import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import SmsAndroid from 'react-native-get-sms-android';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';

export const device = async () => {
  return DeviceInfo.getDevice().then(device => {
    return device;
  });
};

export const validateIdentificationData = identificationData => {
  if (Array.isArray(identificationData)) {
    if (identificationData.length == 0) {
      throw {
        status: false,
        msg: 'identificationData cannot be empty',
      };
    } else {
      for (let i = 0; i < identificationData.length; i++) {
        if (
          !identificationData[i].hasOwnProperty('Value') ||
          !identificationData[i].hasOwnProperty('IdentifierName')
        ) {
          throw {
            status: false,
            msg: "Please make sure that the array contains objects with the keys 'identifierName' and 'value'",
          };
        }
        if (identificationData.length - 1 == i) {
          return true;
        }
      }
    }
  } else {
    throw { status: false, msg: 'identificationData must be an array' };
  }
};

// check permissions
export const checkPermissions = async () => {
  const statuses = await requestMultiple([
    PERMISSIONS.ANDROID.READ_SMS,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ]);

  if (
    statuses[PERMISSIONS.ANDROID.READ_SMS] == 'granted' &&
    statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted' &&
    statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'granted'
  ) {
    return true;
  } else {
    return false;
  }
};

// get customer location...
export const getLocation = async () => {
  // location...
  const location = await GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      const data = {
        status: true,
        data: location,
      };

      return data;
    })
    .catch(error => {
      const data = {
        status: false,
        msg: error.message,
      };
      return data;
    });

  return location;
};

// sms data...
export const getSmsData = async (customSenderOnly) => {
  const date = new Date(); // get date...

  // max date...
  const maxDate = date.getTime();

  // min date...
  date.setMonth(date.getMonth() - 6);
  const minDate = date.getTime();

  const filter = {
    box: 'inbox',
    minDate: minDate, // timestamp (in milliseconds since UNIX epoch)
    maxDate: maxDate, // timestamp (in milliseconds since UNIX epoch)
  };

  let smsObj = [];

  const newPromise = new Promise(async (resolve, reject) => {
    await SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        const data = {
          status: false,
          msg: 'Failed with this error: ' + fail,
        };
        return reject(data);
      },
      (count, smsList) => {
        if (customSenderOnly) {
          const phoneNumberRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
          smsList = smsList.map(sms => !phoneNumberRegex.test(sms.address) ? true : false)
          count = smsList.length
        }
        return resolve({
          smsList: smsList,
          count: count,
        });
      },
    );
  });

  return newPromise;
};

/**
 * Get Device info...
 */

// Gets the time at which the app was first installed, in milliseconds.
export const getFirstInstallTime = async () => {
  return DeviceInfo.getFirstInstallTime().then(firstInstallTime => {
    return firstInstallTime;
  });
};

// Gets the device name.
export const getDeviceName = async () => {
  return DeviceInfo.getDeviceName().then(deviceName => {
    return deviceName;
  });
};

export const getApiLevel = async () => {
  return DeviceInfo.getApiLevel().then(apiLevel => {
    return apiLevel;
  });
};

export const getAndroidId = async () => {
  return DeviceInfo.getAndroidId().then(androidId => {
    return androidId;
  });
};

export const getFingerprint = async () => {
  return DeviceInfo.getFingerprint().then(fingerprint => {
    return fingerprint.toString();
  });
};

export const getManufacturer = async () => {
  return DeviceInfo.getManufacturer().then(manufacturer => {
    return manufacturer;
  });
};

export const getMaxMemory = async () => {
  return DeviceInfo.getMaxMemory().then(maxMemory => {
    return maxMemory;
  });
};

export const isCameraPresent = async () => {
  return DeviceInfo.isCameraPresent()
    .then(isCameraPresent => {
      return isCameraPresent;
    })
    .catch(cameraAccessException => { });
};

// Network
export const getCarrier = async () => {
  return DeviceInfo.getCarrier().then(carrier => {
    return carrier;
  });
};

export const getIpAddress = async () => {
  return DeviceInfo.getIpAddress().then(ip => {
    return ip;
  });
};

export const getMacAddress = async () => {
  return DeviceInfo.getMacAddress().then(mac => {
    return mac;
  });
};

// create unique reference
export const uniqueReference = async () => {
  return Math.floor(new Date().getTime() / 1000).toString();
};
