const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:[{
        id: 0,
        info : "姓名",
        value: "",
        dataName: "userInfoName",
    },{
        id: 1,
        info : "邮箱",
        value: "",
        dataName: "userInfoEmail",
    },{
        id: 2,
        info : "学校",
        value: "",
        dataName: "userInfoSchool",
    },{
        id: 3,
        info : "专业",
        value: "",
        dataName: "userInfoMajor",
    },{
        id: 4,
        info : "毕业时间",
        value: "",
        dataName: "userInfoGradtime",
    },{
        id: 5,
        info : "手机号码",
        value: "",
        dataName: "userInfoPhone",
    }],
      userResume: [],
  },
    deleteResume(e){
        const that = this;
        let userCvId = e.currentTarget.dataset.usercvid;
        wx.showModal({
            title: '提示',
            content: '确定删除这份简历',
            success (res) {
                if (res.confirm) {
                    wx.request({
                        method: "GET",
                        url: api+"/userCv/deleteUserCv",
                        data: {
                            userCvId: userCvId
                        },
                        header: {
                            'cookie' : wx.getStorageSync("cookies"),
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success (res) {
                            that.onLoad();
                            const data = res.data;
                            that.showToast("删除成功",true);
                        },
                        error(error){
                            console.log(error);
                        },
                    })
                }
            }
        })
    },
    downlodeResume(e){
      let url = e.currentTarget.dataset.url;
      const that = this;
        wx.downloadFile({
            url: url,
            success (res) {
                var filePath = res.tempFilePath;
                wx.openDocument({
                    filePath: filePath,
                    success: function(res) {
                        console.log(res);
                    },
                    fail: function(res) {
                        console.log(res);
                    },
                    complete: function(res) {
                        console.log(res);
                    }
                })
            }
        })
      console.log(url);
    },
    uplodeResume(){
      userId = wx.getStorageSync('userId') || undefined;
      const that = this;
      if(!userId) {
          that.showToast("请登入");
          return;
      }
      if(that.data.userResume.length == 5){
          that.showToast("最多可上传5封简历");
          return ;
      }
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success (res) {
                const tempFilePaths = res.tempFiles[0];
                wx.uploadFile({
                    url: api+'/userCv/insertUserCv',
                    filePath: tempFilePaths.path,
                    name: 'file',
                    header:{
                        'cookie' : wx.getStorageSync("cookies").toString(),
                    },
                    formData: {
                        'userId': userId
                    },
                    success (res){
                        console.log(res);
                        const data = res.data;
                        if (data.code == 7){
                            that.showToast(data.message);
                        }else if (data.code == 1) {
                            that.showToast("上传成功",true);
                        }
                    }
                })
            }
        })
    },
    showToast(info,showIcon){
      let icon = showIcon == true ? 'success' : 'none';
        wx.showToast({
            title: info,
            icon: icon,
            duration: 2000
        });
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      userId = wx.getStorageSync('userId') || undefined;
      wx.showLoading({
          title: '加载中',
      })
      const that = this;
      let allInfo = this.data.userData;
    if(!userId){
        wx.hideLoading()
      this.showToast("请登入");
      wx.navigateTo({
        url: '../login/login'
      })
    }
    wx.request({
      method: "GET",
      url: api+"/userCv/selectUserCv",
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        const data = res.data;
        console.log(data)
        if (typeof data.data == "string") {
            wx.hideLoading();
            return
        }
          that.setData({
              userResume : data.data
          });
          wx.hideLoading();
      },
      error(error){
        console.log(error);
      },
    })
    wx.request({
      method: "GET",
      url: api+"/userInfo/select",
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
          const data = res.data.data;
          let infoSet = [];
          for (let infoKey of allInfo){
              for (let info in data){
                  if(infoKey.dataName == info){
                      let infoValue = `userData[${infoKey.id}].value`;
                      that.setData({
                          [infoValue] : data[info],
                      })
                  }
              }
          }
      },
      error(error){
        console.log(error);
      },
    })
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
      this.onLoad();
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
