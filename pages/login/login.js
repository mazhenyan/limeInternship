const app = getApp();
const api = app.globalData.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //按钮失效时间
    time: 30000,
    btnInfo: "获取验证码",
    vertifyAll: false,
    disabled: false,
    userPhone:"",
    timeout: undefined,
  },
  getInput(e){
    clearTimeout(this.data.timeout)
    this.data.timeout = setTimeout(() => {
      let userPhone = e.detail.value;
      //用户手机号码
      this.setData({
        // vertifyPhone: true,
        userPhone: userPhone
      });
    }, 500)
  },
  tapVerify(){
    let that = this;
    let userPhone = this.data.userPhone;
    if(userPhone.length != 11){
      that.showToast('请输入正确手机号码');
      return ;
    }
    if(this.data.disabled == false){
      this.setData({disabled: true});
      setTimeout(()=>{
        this.setData({disabled: false});
      },this.data.time);
      //  发验证码
      wx.request({
        method: "POST",
        url: api+"/sendValidateCode",
        data: {
          userPhone: userPhone
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          const data = res.data;
          console.log(res);
          if(data.code != 1){
            that.showToast('发送验证码失败');
          }
        },
        error(error){
          console.log(error);
        },
      })
    }
  },
  getVertifyInfo(e){
    let userVertify = e.detail.value;
    //还需要进行验证码长度  精确  验证
    if(userVertify.length == 0)return
    //用户验证码
    this.setData({
      userVertify: userVertify,
      vertifyAll: true,
    });
  },
  tapLogin(){
    const that = this;
    if(!this.data.vertifyAll)return ;
    wx.showLoading({
      title: '  ',
    })
    let userVertify = this.data.userVertify;
    let userPhone = this.data.userPhone;
    wx.request({
      method: "POST",
      url: api+"/LoginByValidateCode",
      data: {
        userPhone: userPhone,
        code: userVertify,
        userRole: 'admin'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading();
        const data = res.data;
        if(data.code == 10){
          that.showToast('已失效,请重新验证');
        }else if(data.code == 1){
          let unCookies = res.header["Set-Cookie"];
          console.log(res)
          //更新全局的token
          let cookies = "";
          let cookieArr = unCookies.split(",");
          for (let info of cookieArr){
            cookies+=info+";";
          }
          wx.setStorageSync('userId', data.data.userId);
          wx.setStorageSync('cookies', cookies);
          wx.switchTab({
            url: '../practice/practice'
          });
        }
      },
      error(error){
        console.log(error);
      },
    });
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
