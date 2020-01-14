const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    praticeInfo:[],
    showNone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('moreData', function(data) {
      let moreDetail = data.moreDetail;
      let userInput = data.userInput;
      if(moreDetail){
        wx.request({
          method: "GET",
          url: api+"/positionList/selectByPositionType",
          data: {
            pn: 1,
            positionType: moreDetail
          },
          success (res) {
            let data = res.data;
            if(data.code == 1){
              if(typeof data.data == "string"){
                _this.setData({
                  showNone: true
                })
              }else{
                let detailData = data.data.list;
                for (let info of detailData){
                  info.publishTime = info.publishTime.substr(0,10);
                }
                _this.setData({
                  praticeInfo:detailData
                })
              }
            }
          },
          error(error){
            console.log(error);
          },
        })
      }else if(userInput){
        wx.request({
          method: "GET",
          url: api+"/positionList/selectByPositionNameOrCompany",
          data: {
            pn: 1,
            positionNameOrCompany: userInput
          },
          success (res) {
            let data = res.data;
            if(data.code == 1){
              if(typeof data.data == "string"){
                _this.setData({
                  showNone: true
                })
              }else{
                let detailData = data.data.list;
                for (let info of detailData){
                  info.publishTime = info.publishTime.substr(0,10);
                }
                _this.setData({
                  praticeInfo:detailData
                })
              }
            }
          },
          error(error){
            console.log(error);
          },
        })
      }

    })
  },
  toDetailPratice(e){
    let positionId = e.currentTarget.dataset.positionid;
    let companId = e.currentTarget.dataset.companid;
    wx.navigateTo({
      url: '../positionDetail/positionDetail',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('allData', { positionId: positionId, companId,companId})
      }
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
