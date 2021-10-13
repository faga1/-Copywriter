// pages/TA/TA.js
Page({

  data: {
    uid:'',
    user_list:[]
  },
  onLoad:function(option){
    wx.showShareMenu({
      withShareTicket: true
    })
    var uid=wx.getStorageSync('uid');
    if(!uid){
      getApp().login().then((res)=>{
        if(!res){
          return
        }
        uid=res
        this.setData({
          uid
        })
        this.getUserList(uid)
        this.CancleAllMask()
      })
    }else{
      this.setData({
        uid
      })
      this.getUserList(uid)
      this.CancleAllMask()
    }
  },
  do_callback(curr, total, user_list, temp_list) {
    let that = this;
    if (curr != total) {
      console.log('测试', '任务未结束', curr, '/', total)
      return;
    }
      temp_list.forEach((v,i) => {
        if(v.time){
          var lasttime = v.time.split(' ')
          v.time = lasttime[0]
          v.ismask=false
        }else{
          v.time=''
        }
      })

      user_list = temp_list
      that.setData({
        user_list
      })
  },
  getUserList(uid){
    var that = this
    wx.request({
      url: 'https://www.xdwizz.top/relation1',
      data: {uid:uid},
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res);
        var user_list = that.data.user_list
        var length = res.data.data.length
        var temp_list=res.data.data
        console.log(temp_list);
        temp_list.forEach((v,i)=>{
          that.getThreePic(v.uid).then((val)=>{
            v.picArr=val
            console.log(val);
            that.do_callback(i, length-1, user_list, temp_list)//异步导致setdata存储时图片没有存进去，console.log有延迟，建议打印json格式
          })
        })
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  getThreePic(uid){
    return new Promise(function(resolve){
      wx.request({
        url: 'https://www.xdwizz.top/relation2',
        data:{uid:uid},
        header: {'content-type': 'application/x-www-form-urlencoded'},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success:(res) => {
          var pic_list=[]
          var length = res.data.data.length
          for(var i=0;i<length;i++){
            pic_list[i] = res.data.data[i].pic
          }
          resolve(pic_list)
        }
      })
    })
  },
  handleTool(e){
    var {index}=e.currentTarget.dataset
    var user_list=this.data.user_list
    user_list[index].ismask=true
    this.setData({
      user_list
    })
  },
  CancleMask(e){
    var {index}=e.currentTarget.dataset
    var user_list=this.data.user_list
    user_list[index].ismask=false
    this.setData({
      user_list
    })
  },
  CancleAllMask(){
    var user_list=this.data.user_list
    console.log(user_list);
    user_list.forEach((v)=>{
      v.ismask=false
    })
    this.setData({
      user_list
    })
  },
  EnterTA(e){
    var {index}=e.currentTarget.dataset
    var uid=this.data.user_list[index].uid
    wx.navigateTo({
      url: '/pages/TA_detail/TA_detail?uid='+uid,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  set_top(){

  },
  share(e){
    
  },
  delete(e){
    var {index}=e.currentTarget.dataset
    var user_list=this.data.user_list
    var uid1=this.data.uid
    var uid2 = user_list[index].uid
    user_list.splice(index,1)
    wx.request({
      url: 'https://www.xdwizz.top/delfriends',
      data:{uid1:uid1,uid2:uid2},
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success:(res)=>{
        this.CancleAllMask()
        this.getUserList(uid1)
      }
    })
    this.setData({
      user_list
    })
  },
  onShareAppMessage:function(res){
    if(res.from==='button'){
      console.log(res.target);
      var {index}=res.target.dataset
      var uid=this.data.user_list[index].uid
      console.log(uid);
    }
    return{
      title:'你的文案馆',
      path:'/pages/TA_detail/TA_detail?uid=' +uid,
      success:(res) => {
        
      }
    }
  }
})