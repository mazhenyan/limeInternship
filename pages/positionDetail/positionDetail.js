const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
// pages/positionDetail/positionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('allData', function(data) {
      let positionId = data.positionId;
      let companId = data.companId;

      wx.request({
        method: "GET",
        url: api+"/positionInfo/selectById",
        data: {
          positionId: positionId
        },
        success (res) {
          let data = res.data;
          if(data){
            let allInfo = data.data;
            let companyInfo = allInfo.company;
            let positionInfo = allInfo.positionInfo;
            positionInfo.publishTime = positionInfo.publishTime.substr(0,10)
            for (let info in companyInfo) {
              positionInfo[info] = companyInfo[info]
            }
            _this.setData({
              positionInfo:positionInfo,
            })

          }
        },
        error(error){
          console.log(error);
        },
      })

    })
  },
  collection(){
    let positionId = this.data.positionInfo.positionId;
    let companyId = this.data.positionInfo.companyId;
    let _this = this;
    wx.request({
      method: "POST",
      url: api+"/positionCollection/insert",
      data: {
        userId: wx.getStorageSync('userId') || undefined,
        positionId: positionId
      },
      header: {
        'cookie' : wx.getStorageSync("cookies"),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        console.log(res.data)
        let data = res.data;
        if(data.code == 10){
          _this.showToast("请登入",false)
        }else if(data.code == 1){
          _this.showToast("投递成功",true)
        }
      },
      error(error){
        console.log(error);
      },
    })

  },
  delivery(){
    let positionId = this.data.positionInfo.positionId;
    let companyId = this.data.positionInfo.companyId;
    let _this = this;
    wx.request({
      method: "POST",
      url: api+"/deliverCv/insert",
      data: {
        userId: wx.getStorageSync('userId') || undefined,
        userCvId: 1,
        positionId: positionId
      },
      header: {
        'cookie' : wx.getStorageSync("cookies"),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        let data = res.data;
        if(data.code == 10){
          _this.showToast("请登入",false)
        }else if(data.code == 1){
          _this.showToast("投递成功",true)
        }
      },
      error(error){
        console.log(error);
      },
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
