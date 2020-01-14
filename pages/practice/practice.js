const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
let choosePlace = wx.getStorageSync('choosePlace') || "北京";
// pages/practice/practice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInfo:[{
      id: 1,
      img:'/images/practiceIcon/one.png',
      info:'秋招专场'
    },{
      id: 2,
      img:'/images/practiceIcon/two.png',
      info:'春招专场'
    },{
      id: 3,
      img:'/images/practiceIcon/three.png',
      info:'暑假实习'
    },{
      id: 4,
      img:'/images/practiceIcon/four.png',
      info:'运营喵'
    },{
      id: 5,
      img:'/images/practiceIcon/five.png',
      info:'技术猿'
    }],
    praticeInfo:[],
    choosePlace: choosePlace,
    toMorePratice:['秋招','春招','暑假','运营','技术'],
    timeout: undefined,
    userInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(choosePlace == "全国"){
      this.getAllPratice();
      return
    }
    wx.request({
      method: "GET",
      url: api+"/positionList/selectByPositionArea",
      data: {
        positionArea: choosePlace
      },
      success (res) {
        let data = res.data;
        if(typeof data.data != "string"){
          let praticeInfo = data.data.list;
          for (let info of praticeInfo){
            info.publishTime = info.publishTime.substr(0,10)
          }
          _this.setData({
            praticeInfo: praticeInfo
          })
        }
      },
      error(error){
        console.log(error);
      },
    })
  },
  onComfirm(){
    let userInput = this.data.userInput;
    wx.navigateTo({
      url: '../morePratice/morePratice',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('moreData', { userInput: userInput})
      }
    });
  },
  getUserInput(e){
    clearTimeout(this.data.timeout);
    this.data.timeout = setTimeout(() => {
      let userInput = e.detail.value;
      this.setData({
        // vertifyPhone: true,
        userInput: userInput
      });
    }, 200)
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
  choosePosition(e){
    wx.navigateTo({
      url: '../position/position',
    })
  },
  toMore(e){
    let id = e.currentTarget.dataset.id;
    let moreDetail = this.data.toMorePratice[id-1];

    wx.navigateTo({
      url: '../morePratice/morePratice',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('moreData', { moreDetail: moreDetail})
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  getAllPratice(){
    let _this = this;
    wx.request({
      method: "GET",
      url: api+"/positionList/selectAll",
      data: {
        pn: 1
      },
      header: {
        'cookie' : wx.getStorageSync("cookies"),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        let data = res.data;
        if(data.data){
          let praticeInfo = data.data.list;
          for (let info of praticeInfo){
            info.publishTime = info.publishTime.substr(0,10)
          }
          _this.setData({
            praticeInfo: praticeInfo
          })
        }
      },
      error(error){
        console.log(error);
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    choosePlace = wx.getStorageSync('choosePlace') || "北京";
    if(choosePlace === this.data.choosePlace)
      return ;
    this.setData({
      choosePlace: choosePlace
    });
    if(choosePlace == "全国"){
      _this.getAllPratice();
      return ;
    }
    wx.request({
      method: "GET",
      url: api+"/positionList/selectByPositionArea",
      data: {
        positionArea: choosePlace
      },
      success (res) {
        let data = res.data;
        if(typeof data.data != "string"){
          let praticeInfo = data.data.list;
          for (let info of praticeInfo){
            info.publishTime = info.publishTime.substr(0,10)
          }
          _this.setData({
            praticeInfo: praticeInfo
          })
        }else{
          _this.setData({
            praticeInfo: []
          })
        }
      },
      error(error){
        console.log(error);
      },
    })
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
