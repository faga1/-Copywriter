var app =getApp()
Page({
  data: {
     uid:'',
     sentence_list:[]
  },
  pagenum:1,
  onLoad:function(){
    var uid=wx.getStorageSync('uid');
    if(!uid){
      app.login().then((res)=>{
        if(!res){
          return 
        }
        uid=res
        this.setData({
          uid
        })
        console.log(uid);
        this.getsentenceList(this.pagenum,uid)
      })
    }else{
      this.setData({
        uid
      })
      console.log(uid);
      this.getsentenceList(this.pagenum,uid)
    }
    wx.showShareMenu({
      withShareTicket:true,
      menus: ['shareAppMessage']
    })
  },
  getsentenceList:function(page,id){
    wx.request({
      url: 'https://www.xdwizz.top/sentence',
      data: {page:page,uid:id},
      method: 'GET',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: (res) => {
        console.log(res);
        var sentence_list=this.data.sentence_list
        var temp_list = res.data.data
        temp_list.forEach((v,i) => {
          var time = v.dateTime.split(' ')
          var sentence1=v.sentence.split('——')
          v.sentence=sentence1[0]
          v.sentence_from=sentence1[1]
          v.dateTime = time[0]
        })
        sentence_list=temp_list
        this.setData({
          sentence_list
        })
        if(res.data.data.length===0){
            wx.showToast({
              title:'无更多收藏文案',
              duration:1000,
              icon:'none'
            }) 
        }
      },
      fail: () => {},
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
    var picture=this.data.sentence_list[index].picture
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
  CancleCollect(e){
    var {index}=e.currentTarget.dataset
    var sentence_list=this.data.sentence_list
    var sid=sentence_list[index].sid
    wx.request({
      url:'https://www.xdwizz.top/unlike',
      data:{uid:this.data.uid,sid:sid},
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method:'POST',
      success:(res)=>{
        // console.log(res);
        this.getsentenceList(this.pagenum,this.data.uid)
      }
    })
    this.setData({
      sentence_list
    })
  },
  onReachBottom(){
    wx.showToast({
      title:'无更多收藏文案',
      icon:'none',
      duration:1000
    })
  },
  onShareAppMessage(res) {
    console.log(res);
    if(res.from==='button'){
      var uid=this.data.uid
    }
    return {
      title: '你的文案馆子',
      path:'/pages/TA_detail/TA_detail?uid='+uid,
    }
  }
    
  })

  