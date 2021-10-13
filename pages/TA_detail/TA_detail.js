
Page({
  data: {
    uid2:'',
    sentence_list:[],
    uid1:''
  },
  pagenum:1,
  onLoad:function(options){
    console.log('TA_detail'+options);
    var uid2=options.uid
    getApp().globalData.uid2=uid2
    this.setData({
      uid2
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getsentenceList(this.pagenum,uid2)
  },
  onHide(){
    var uid1=wx.getStorageSync('uid')
    wx.request({
      url:'https://www.xdwizz.top/addfriends',
      data:{uid1:uid1,uid2:this.data.uid2},
      header: {'content-type': 'application/x-www-form-pictureencoded'},
      success:(res)=>{
        console.log(res);
      }
    })
  },
  getsentenceList:function(page,id){
    wx.request({
      url: 'https://www.xdwizz.top/sentence',
      data: {page:page,uid:id},
      method: 'GET',
      header: {'content-type': 'application/x-www-form-pictureencoded'},
      success: (res) => {
        console.log(res);
        if(res.statusCode!==200){
          return wx.showToast({
            title: '获取文案失败',
            duration: 1000
          })
        }
        if(res.data.data.length===0){
          return wx.showToast({
            title:'无更多文案',
            duration:1000,
            icon:'none'
          })
        }
        var sentence_list=this.data.sentence_list
        var temp_list = res.data.data
        temp_list.forEach((v,i) => {
          var time = v.dateTime.split(' ')
          var sentence1=v.sentence.split('——')
          v.sentence=sentence1[0]
          v.sentence_from=sentence1[1]
          v.dateTime = time[0]
        })
        this.pagenum++
        sentence_list=[...sentence_list,...res.data.data]
        this.setData({
          sentence_list
        })
      },
      fail: (err) => {
        console.log(err);
      },
      complete: () => {}
    });
  },
  handleReturnTop:function(){
    wx.pageScrollTo({
      scrollTop:0
    })
  },
  copy_sentence:function(e){
    var {index}=e.currentTarget.dataset
    var sentence=this.data.sentence_list[index].sentence
    wx.setClipboardData({
      data: sentence,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  save(e){
    var {index}=e.currentTarget.dataset
    let that =this
    wx.showToast({
      icon:'loading',
      title:'正在保存图片',
      duration:1000
    })
    wx.getSetting({
      success: (res) => {
        if(!res.authSetting['scope.writePhotoAlbum']){
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (res) => {
              that.save_image(index)
            },
            fail: () => {
              wx.openSetting({
                success: (result) => {
                  wx.authorize({
                    scope:"scope.writePhotosAlbum",
                    success(){
                      that.save_image(index)
                    }
                  })
                },
              });
                
            },
          });
            
        }else{
          that.save_image(index)
        }
      },
    });
  },
  save_image(index){
    let that=this
    var picture=this.data.collected_list[index].picture
    wx.downloadFile({
      url: picture,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            wx.showToast({
              title: '保存成功',
              icon:"success",
              duration: 1000,
            });
              
          },
          fail: () => {},
          complete: () => {}
        });
          
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  collect(e){
    var {index}=e.currentTarget.dataset
    var sentence_list=this.data.sentence_list
    sentence_list[index].iscollected=!sentence_list[index].iscollected
    var sid = sentence_list[index].sid
    var uid = wx.getStorageSync('uid');
    if(!uid){
      return getApp().login()
    }
    var iscollected = sentence_list[index].iscollected
    if(!iscollected){
      wx.request({
        url: 'https://www.xdwizz.top/unlike',
        data: {
          uid: uid,
          sid: sid
         },
         header: {'content-type': 'application/x-www-form-urlencoded'},
         method: 'get',
         success: (res) => {
          if(res.statusCode !== 200){
            return wx.showToast({
              title:'取消收藏失败',
              duration: 1000,
              icon: 'none'
            })
          }
         },
       });
    }else{
      wx.request({
        url: 'https://www.xdwizz.top/like',
        data: {
          uid: uid,
          sid: sid
         },
         header: {'content-type': 'application/x-www-form-urlencoded'},
         method: 'get',
         success: (res) => {
          if(res.statusCode !== 200){
            return wx.showToast({
              title:'收藏失败',
              duration: 1000,
              icon: 'none'
            })
          }
          if (res.data.responseCode === '403'){
            wx.showToast({
              title: '此文案已经收藏过',
              duration: 1000,
              icon:'none'
            })
          }
         },
     });
    }
    this.setData({
      sentence_list
    })
  },
  onReachBottom(){
    var uid=this.data.uid
    this.getsentenceList(this.pagenum,uid)
  },
  onShareAppMessage:function(res){
    if(res.from==='button'){
      console.log(res.target);
      var {index}=res.target.dataset
      var uid=this.data.uid
      console.log(uid);
    }
    return{
      title:'你的文案馆',
      path:'pages/TA_detail/TA_detail?uid='+uid,
      success:(res) => {
        console.log(res);
      }
    }
  }
});
  