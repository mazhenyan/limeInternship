const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumeInfo: []
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
    let that = this;
    let action = e.currentTarget.dataset.action;
    let id = e.currentTarget.dataset.positionid;
    let usercvid =  e.currentTarget.dataset.usercvid;
    //标识点击的是投递
    if(action == 0){
      wx.showModal({
        title: '提示',
        content: '确定删除',
        success (res) {
          if (res.confirm) {
            wx.request({
              method: "GET",
              url: api+"/deliverCv/delete",
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie' : wx.getStorageSync("cookies"),
              },
              data: {
                userCvId: usercvid,
                positionId: id
              },
              success (res) {
                const data = res.data;
                if(data.code == 1){
                  that.onLoad();
                  wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 2000
                  });
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
  goIndex(){
    wx.switchTab({
      url: '../practice/practice'
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
    if(!userId){
      wx.redirectTo({
        url: '../login/login'
      })
      return ;
    }
    const that = this;
    wx.request({
      method: "GET",
      url: api+"/deliverCv/selectByUserId",
      data: {
        userId: userId
      },
      success (res) {
        const data = res.data;
        let allResume = [];
        for (let id in data.data){
          for (let info of data.data[id]){
            //对时间进行截取
            info.publishTime = info.publishTime.substr(5,5);
            //对标签进行裁切
            let positionLabel = info.positionLabel;
            if(positionLabel) {
              info.positionLabel = positionLabel.split(",");
            }
            info.detailAction = 0;//投递简历的标志
            info.resumeId = id;
            allResume.push(info);
          }
        }
        that.setData({
          resumeInfo : allResume
        });
        wx.hideLoading();
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
