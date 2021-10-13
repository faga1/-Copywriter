//app.js

App({
    // onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
    onLaunch: function(options) {
        let userInfo=wx.getStorageSync("userInfo")
        // this.globalData.userInfo=userInfo
        // const that=this
        // console.log(this);
        this.login()
    },
    login(){
        return new Promise((resolve)=>{
            wx.showModal({
                title: '获取用户信息',
                content: '是否可以获取你的信息',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                    if (result.confirm) {
                        new Promise(resolve=>{
                            wx.getUserProfile({
                                desc:"用于获取用户信息",
                                success:(res)=>{
                                    let userInfo=res.userInfo
                                    wx.setStorageSync("userInfo",userInfo)
                                    resolve('success')
                                }
                            }) 
                        }).then((val)=>{
                            console.log(val);
                            if(wx.getStorageSync('uid')){
                                this.globalData.uid=wx.getStorageSync('uid')
                                // console.log(that);
                            }else{
                                var userInfo = wx.getStorageSync('userInfo')
                                 wx.login({
                                     success: (res) => {
                                         var code=res.code
                                         if(code){
                                             wx.request({
                                                url: 'https://www.xdwizz.top/login',
                                                data: {
                                                    code:code,
                                                    avatar:userInfo.avatarUrl,
                                                    userName:userInfo.nickName
                                                 },
                                                 header: {'content-type': 'application/x-www-form-urlencoded'},
                                                 method: 'get',
                                                 success: (res) => {
                                                    // console.log(res);
                                                    if (res.data.error_code!=="200"){
                                                       return wx.showToast({
                                                           title: '登录失败',
                                                           icon:'none',
                                                           duration: 1500,
                                                       });
                                                         
                                                    //    console.log(that.globalData.uid);
                                                    }
                                                    var uid=res.data.uid
                                                    wx.setStorageSync('uid',uid)
                                                    console.log(uid);
                                                    this.globalData.uid=uid
                                                    resolve(uid)
                                                 },
                                             });
                                              
                                         }
                                     },
                                 });
                            }
                        })
                        
                        
                    }
                },
            });
        })
        
    },
    addFriends(uid1,uid2){
        wx.request({
            url:'https://www.xdwizz.top/addfriends',
            data:{
              uid1:uid1,
              uid2:uid2
            },
            method: 'GET',
            header: {'content-type': 'application/x-www-form-pictureencoded'},
            success:(res)=>{
              console.log(res);
            }
          })
    },
    onShow: function(options) {

    },
    onHide: function() {

    },
    onError: function(msg) {

    },
    //options(path,query,isEntryPage)
    onPageNotFound: function(options) {

    },
    globalData:{
    }
});
  