const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumeInfo: [],

  },
  goIndex(){
    wx.switchTab({
      url: '../practice/practice'
    })
  },
  detailCompany(e){
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
  deleteResume(e){
    userId = wx.getStorageSync('userId') || undefined;
    const that = this;
    let action = e.currentTarget.dataset.action;
    let id = e.currentTarget.dataset.positionid;
    //标识点击的是收藏
    if(action == 1){
      wx.showModal({
        title: '提示',
        content: '确定取消',
        success (res) {
          if (res.confirm) {
            wx.request({
              method: "POST",
              url: api+"/positionCollection/delete",
              header: {
                'cookie' : wx.getStorageSync("cookies"),
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                userId: wx.getStorageSync('userId') || undefined,
                positionId: id
              },
              success (res) {
                const data = res.data;
                if(data.code == 1){
                  that.showToast("取消成功",true);
                }
              },
              error(error){
                console.log(error);
              },
            })
          }
        }
      })
    }
  },
  showToast(info,flag){
    let icon = flag == true ? 'success' : 'none'
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
    if(!userId){
      wx.hideLoading()
      wx.redirectTo({
        url: '../login/login'
      })
      return ;
    }
    const that = this;
    wx.request({
      method: "GET",
      url: api+"/positionCollection/select",
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        const data = res.data;
        for (let info of data.data) {
          info.publishTime = info.publishTime.substr(5,5);

          let str = info.positionLabel;
          if(str) {
            info.positionLabel = str.split(",");
          }
          info.detailAction = 1;//收藏的标志
        }
        that.setData({
          resumeInfo : data.data
        });
        wx.hideLoading()
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
