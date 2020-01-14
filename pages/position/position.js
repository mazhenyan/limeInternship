// pages/position/position.js
var cityInfo = require("../../data/json");
let choosePlace = wx.getStorageSync('choosePlace') || "北京";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    presentCity:choosePlace,
    hotCities:[],
    cities:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hotCities:cityInfo.cityInfo.data.hotCities,
      cities:cityInfo.cityInfo.data.cities,
    })
  },
  chooseCity(e){
    let city = e.currentTarget.dataset.city;
    wx.setStorageSync('choosePlace', city);
    this.setData({
      presentCity: city
    })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    choosePlace = wx.getStorageSync('choosePlace') || "北京";
    this.setData({
      presentCity: choosePlace
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    choosePlace = wx.getStorageSync('choosePlace') || "北京";
    this.setData({
      presentCity: choosePlace
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
