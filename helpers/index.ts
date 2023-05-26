import SInfo from 'react-native-sensitive-info';

export async function SecureSave({key, value}: {key: string; value: string}) {
  return await SInfo.setItem(key, value, {});
}

export async function SecureGet(key: string) {
  return await SInfo.getItem(key, {});
}

export async function deleteToken(key: string) {
  return await SInfo.deleteItem(key, {});
}
