const app = getApp();
const api = app.globalData.api;
let userId = wx.getStorageSync('userId') || undefined;
let url = api+"/userInfo/insert";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerData:[{
      id: 0,
      info : "姓名",
      value: "",
      dataName: "userInfoName",
      vertify: false,
    },{
      id: 1,
      info : "邮箱",
      value: "",
      dataName: "userInfoEmail",
      vertify: false,
    },{
      id: 2,
      info : "学校",
      value: "",
      dataName: "userInfoSchool",
      vertify: false,
    },{
      id: 3,
      info : "专业",
      value: "",
      dataName: "userInfoMajor",
      vertify: false,
    },{
      id: 4,
      info : "毕业时间",
      value: "",
      dataName: "userInfoGradtime",
      vertify: false,
    },{
      id: 5,
      info : "手机号码",
      value: "",
      dataName: "userInfoPhone",
      vertify: false,
    }],
  },
  getInput(e){
    let id = e.currentTarget.dataset.id;
    let info = e.detail.value;
    if(!info)return ;
    let setData = `registerData[${id}].value`;
    let setVertify = `registerData[${id}].vertify`;
    let emailReg=/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if(id == 1){
      if(emailReg.test(info)){
        this.setData({
          [setData] : info,
          [setVertify] : true,
        });
      }else{
        this.showToast("请填写正确的邮件格式");
      }
    }else{
      this.setData({
        [setData] : info,
        [setVertify] : true,
      });
    }
  },
  tapComfirm(){
    if(!userId){
      this.showToast("请登录",false);
      setTimeout(()=>{
        wx.navigateTo({
          url: '../login/login'
        })
      },1000);
    }
    let info = new Object();
    let allInfo = this.data.registerData;
    for (let inputInfo in allInfo){
      let data = allInfo[inputInfo];
      if(data.vertify == false){
        this.showToast(`请输入正确的`+data.info)
        return ;
      }
      info[data.dataName] = allInfo[inputInfo].value;
    }
    info.userId = userId;
        //  发送验证信息
    wx.request({
      method: "POST",
      url: url,
      data: info,
      header: {
        'cookie' : wx.getStorageSync("cookies"),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        const data = res.data;
        if(data.code == 1){
          wx.switchTab({
            url: '../user/user'
          })
        }
      },
      error(error){
        console.log(error);
      },
    })
  },
  showToast(info){
    wx.showToast({
      title: info,
      icon: 'none',
      duration: 2000
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userId = wx.getStorageSync('userId') || undefined;
  //  获得之前的用户信息
    if(!userId){
      this.showToast("请登入");
      wx.navigateTo({
        url: '../login/login'
      })
      return ;
    }
    let allInfo = this.data.registerData;
    const that = this;

    wx.request({
      method: "GET",
      url: api+"/userInfo/select",
      data: {
        userId: userId
      },
      success (res) {
        const data = res.data;
        if(data.code == 1){
          let userdata = data.data;
          for (let infoKey of allInfo){
            for (let info in userdata){
              if(infoKey.dataName == info){
                let infoValue = `registerData[${infoKey.id}].value`;
                let infoVertify = `registerData[${infoKey.id}].vertify`;
                that.setData({
                  [infoValue] : userdata[info],
                  [infoVertify] : true
                })
              }
            }
          }
          url = api+"/userInfo/update";
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
