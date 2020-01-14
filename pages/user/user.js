const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    defaultName: '未登入',
    defaultAvatar: '/images/icons/practiceLogo.png',
    userChooseList: [{
      id:0,
      icon: '/images/icons/jianli.png',
      info: '我的简历',
      show:true,
      jump: '../resume/resume'
    },{
      id:1,
      icon: '/images/icons/toudi.png',
      info: '我的投递',
      show:true,
      jump: '../deliveryResume/deliveryResume'
    },{
      id:2,
      icon: '/images/icons/shoucang.png',
      info: '我的收藏',
      show:true,
      jump: '../myCollection/myCollection'
    },{
      id:3,
      icon: '/images/icons/aboutUs.png',
      info: '关于我们',
      show:true,
      jump: '../aboutUs/aboutUs',
    },{
      id:4,
      icon: '/images/icons/tuichu.png',
      info: '退出登入',
      show:false,
      jump: null,
    },{
      id:5,
      icon: '/images/icons/denglu.png',
      info: '点击登入',
      show:false,
      jump: '../login/login'
    }],
    aboutUsBtn: 3,
    exitBtn: 4,
    exitFlag: false,
  },
  fillUserInfo(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  handleTap(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    if(this.data.login){
        if (id == that.data.exitBtn){
            that.setData({
                exitFlag: true
            });
            wx.showModal({
                title: '提示',
                content: '确定退出',
                success (res) {
                    if (res.confirm) {
                        wx.clearStorage();
                        that.onLoad();
                    }
                }
            })
        } else{
            wx.navigateTo({
                url: that.data.userChooseList[id].jump,
            })
        }
    }else{
        if (id == that.data.aboutUsBtn){
            wx.navigateTo({
                url: that.data.userChooseList[id].jump,
            })
        }
        wx.navigateTo({
            url: '../login/login',
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = wx.getStorageSync('userId') || undefined;
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let infoExit = "userChooseList[4].show";
    let infoLogin = "userChooseList[5].show";

    if(userId){
      wx.request({
        method: "GET",
        url: api+"/userInfo/select",
        data: {
          userId: userId
        },
        success (res) {
          let dataAll = res.data;
          let userName = "";
          if(dataAll.code == 2){
            userName = "未填写信息";
          }else{
            const data = res.data.data;
            userName = data.userInfoName;
          }
          that.setData({
            login: true,
            defaultName: userName,
            [infoExit] : true,
            [infoLogin] : false
          });
          wx.hideLoading()
        },
        error(error){
          console.log(error);
        },
      })
    }else{
      that.setData({
        [infoExit] : false,
        [infoLogin] : true,
        defaultName : '未登入'
      });
      wx.hideLoading()
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
    userId = wx.getStorageSync('userId') || undefined;
    if(this.data.exitFlag){
      console.log("exit");
      this.onLoad()
    }
    this.onLoad();
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
});
