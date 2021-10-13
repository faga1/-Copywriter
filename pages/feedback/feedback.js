// pages/feedback/feedback.js
Page({
  data: {
    uid:'',
    msg:''
  },
  storeMsg(e){
    var msg = e.detail.value
    console.log(msg);
    this.setData({
      msg
    })
    console.log(this.data.msg);
  },
  submit_msg(){
    console.log(this.data.uid);
    console.log(this.data.msg);
    if(this.data.msg.trim()===''){
        wx.showToast({
          title:'请输入反馈信息',
          icon:'none'
        })
        this.setData({
          msg:''
        })
    }else{
      wx.request({
        url:'https://www.xdwizz.top/feedback/post',
        data:{uid:this.data.uid,content:this.data.msg},
        method:'POST',
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success:(res)=>{
          console.log(res);
          if(res.data.responseCode!=='200'){
            return wx.showToast({
              title:'反馈失败',
              icon:'none',
              duration:1000
            })
          }
          wx.switchTab({
            url: '/pages/index/index',
            success: (result) => {
              wx.showToast({
                icon:'none',
                title:'感谢您的反馈',
                duration:1000
              })
            },
          });
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var uid=wx.getStorageSync('uid');
      if(!uid){
        getApp().login().then(res=>{
          if(!res){
            return
          }
          uid=res
          this.setData({
            uid
          })
        })
      }
      else{
        this.setData({
          uid
        })
      }  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})