/**
 * 判断是微信环境/企业微信环境/其他
 */
const getWxClient = function () {
  let wxenv='';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    if(ua.match(/wxwork/i) == 'wxwork'){
      wxenv='wxwork'
    }else{
      wxenv='wx'
    }
  }else{
    wxenv='other'
  }
  return wxenv;
};
export {getWxClient}
