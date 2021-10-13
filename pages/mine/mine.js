// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
  },

  
  onShow: function () {
    let userInfo=wx.getStorageSync("userInfo");
    this.setData({
      userInfo,
    })
  },
})