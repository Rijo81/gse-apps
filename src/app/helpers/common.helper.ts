function getPhoneFormat(phone?: string) {
  return phone ? '+1' + phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('+1', '') : ''
}

const messageToWhatsapp = function (phone?: string, text = 'hola, ') {
  if (!phone) return
  phone = phone?.replaceAll('-', '')?.replaceAll(' ', '');
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}
const openGoogleMap = function (latitude: any, longitude: any) {
  if (latitude && longitude) {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      '_blank'
    );
    return;
  }

}

const emailIsValid = function (email: string) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export {
  getPhoneFormat,
  messageToWhatsapp,
  openGoogleMap,
  emailIsValid
}
