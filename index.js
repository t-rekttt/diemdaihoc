require('dotenv').config()
const request = require('request-promise')

vnexpress = (text) => {
  return request(`https://diemthi.vnexpress.net/index/result?q=${text}&college=0&area=2`, {json: 1})
    .then(res => {
      if (res.data == 'Không tìm thấy kết quả') res.data = [];
      return res;
    })
}

thanhnien = (text) => {
  return request(`https://thanhnien.vn/ajax/diemthi.aspx?kythi=THPT&nam=2018&city=&text=${text}&top=no`)
    .then(res => res.trim())
}

send_message = (uid, token, text) => {
  UA = '[FBAN/FB4A;FBAV/146.0.0.53.92;FBBV/75931096;FBDM/{density=2.0,width=720,height=1280};FBLC/en_US;FBRV/76239346;FBCR/VIETTEL;FBMF/Lenovo;FBBD/Lenovo;FBPN/com.facebook.katana;FBDV/Lenovo A6000;FBSV/7.1.2;FBOP/1;FBCA/armeabi-v7a:armeabi;]'

  params = {
      'locale': 'en_US',
      'to': JSON.stringify([{"type":"id","id": uid}]),
      'method': 'post',
      'return_structure': true,
      'message': text,
      'access_token': token
  }
  
  r = request.post('https://graph.facebook.com/me/threads', {headers: {'User-Agent': UA}, form: params})
  return r
}

setInterval(() => {
  try {
    vnexpress(process.env.sbd).then(res => {
      if (res.data && res.data.length) send_message(process.env.uid, process.env.access_token, JSON.stringify(res.data)).then(res => console.log(res));
      console.log('VNExpress: '+JSON.stringify(res.data));
    }).catch(e => console.log(e))

    thanhnien(process.env.sbd).then(res => {
      if (res) send_message(process.env.uid, process.env.access_token, res);
      console.log('Thanhnien: '+res);
    }).catch(e => console.log(e))
  } catch (e) {
    console.log(e)
  }
}, 10000)