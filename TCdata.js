var gtshuju = "";
var github = "https://ghp.ci/" ;
const url = `https://ife.etcp.cn/api/v1/coupon/coupon-handout-channel`;
const url3 = `https://ife.etcp.cn/api/v1/wx/scheme-generate`;

const headers = {
'Accept' : `*/*`,
'Accept-Encoding' : `gzip, deflate, br`,
'Connection' : `keep-alive`,
'Content-Type' : `application/x-www-form-urlencoded`,
'Host' : `ife.etcp.cn`,
'User-Agent' : `BackgroundShortcutRunner/1146.11.1 CFNetwork/1331.0.7 Darwin/21.4.0`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`
};
const headers3 = {
'Content-Type' : `application/json`
};

function zhongcheLoading() {
  $ui.render({
    props: { bgcolor: $color("#F0F4F8") },
    views: [
      {
        type: "view",
        props: { id: "imageContainer", clipsToBounds: true, bgcolor: $color("clear") },
        layout: (make, view) => {
          make.centerX.equalTo(view.super)
          make.centerY.equalTo(view.super).offset(-80)
          make.size.equalTo($size(90, 90))
        },
        views: [
          {
            type: "image",
            props: { id: "loadingImage", src: "https://gaitu.oss-cn-hangzhou.aliyuncs.com/assets/edc2d09040d4460b9c3d85bec4b05ab5.gif", radius: 45, alpha: 0 },
            layout: $layout.fill
          }
        ]
      },
      {
        type: "label",
        props: { id: "loadingLabel", text: "准备启程...", align: $align.center, font: $font("bold", 18), textColor: $color("#2C3E50"), alpha: 0 },
        layout: (make, view) => {
          make.centerX.equalTo(view.super)
          make.top.equalTo($("imageContainer").bottom).offset(20)
        }
      },
      {
        type: "progress",
        props: { id: "progress", value: 0, trackColor: $color("#E0E7FF"), progressColor: $color("#3498DB"), alpha: 0 },
        layout: (make, view) => {
          make.centerX.equalTo(view.super)
          make.top.equalTo($("loadingLabel").bottom).offset(15)
          make.width.equalTo(view.super).multipliedBy(0.8)
          make.height.equalTo(6)
        }
      },
      {
        type: "label",
        props: { id: "percentLabel", text: "0%", align: $align.center, font: $font(14), textColor: $color("#7F8C8D"), alpha: 0 },
        layout: (make, view) => {
          make.centerX.equalTo(view.super)
          make.top.equalTo($("progress").bottom).offset(10)
        }
      },
      {
        type: "label",
        props: { 
          id: "beizhu", 
          text: "by:中车大神\n\n宗旨:看不过来没关系，但必须拥有!\n\n仅供学习禁止倒卖\n\n更新日期：2024-10-31",
          align: $align.center, textColor: $color("#8496B8"), font: $font(12), lines: 0, alpha: 0 
        },
        layout: (make, view) => {
          make.centerX.equalTo(view.super)
          make.bottom.equalTo(view.super).offset(-30)
          make.left.right.inset(20)
        }
      } 
    ]
  });
  
  $ui.animate({
    duration: 0.8,
    animation: () => {
      ["loadingImage", "loadingLabel", "progress", "percentLabel", "beizhu"].forEach(id => $(id).alpha = 1)
    },
    completion: () => {
      simulateLoading()
    }
  })
}

function simulateLoading() {
  let progress = 0;
  const intervalID = setInterval(() => {
    progress += 0.01;
    if (progress > 0.6) { // 到60%时开始请求数据
      clearInterval(intervalID);
      $("loadingLabel").text = "正在获取数据...";
      
      // 发起数据请求
      $http.get({
        url: github+'https://raw.githubusercontent.com/Q39547190/QXG/refs/heads/main/xhwanda.txt',
        handler: function(resp) {
          if (resp.data) {
            // 数据获取成功，完成剩余加载动画
            gtshuju = resp.data;
            completeLoading();
          } else {
            // 数据获取失败处理
            $("loadingLabel").text = "数据获取失败，请重试";
          }
        }
      });
    }
    
    $ui.animate({
      duration: 0.3,
      animation: () => {
        $("progress").value = progress;
        $("percentLabel").text = Math.round(progress * 100) + "%";
      }
    });
  }, 20);
  
  // 完成加载的函数
  function completeLoading() {
    let finalProgress = 0.6;
    const finalInterval = setInterval(() => {
      finalProgress += 0.02;
      if (finalProgress >= 1) {
        finalProgress = 1;
        clearInterval(finalInterval);
        $("loadingLabel").text = "准备就绪，开始启程！";
        
        // 淡出动画
        $ui.animate({
          duration: 0.8,
          delay: 0.5,
          animation: () => {
            ["imageContainer", "loadingLabel", "progress", "percentLabel", "beizhu"].forEach(id => $(id).alpha = 0)
          },
          completion: () => {
            console.log("加载完成，准备进入主页面")
            //
            get_updata();
            getdlist();
            updateSongList(gtshuju);
          }
        });
      }
      
      $ui.animate({
        duration: 0.3,
        animation: () => {
          $("progress").value = finalProgress;
          $("percentLabel").text = Math.round(finalProgress * 100) + "%";
        }
      });
    }, 20);
  }
}





function getdlist() {


$ui.render({
  views: [
    {
      type: "view",
      props: {
        id: "container"
      },
      layout: $layout.fill,
      views: [
        {
          type: "list",
          props: {
            id: "songList",
            rowHeight: 80,
            template: [
              {
                type: "image",
                props: {
                  id: "cover",
                  radius: 10
                },
                layout: function(make, view) {
                  make.left.top.bottom.inset(10);
                  make.width.equalTo(view.height);
                }
              },
              {
                type: "label",
                props: {
                  id: "songInfo",
                  textColor: $color("#000"),
                  font: $font(16),
                  align: $align.left,
                  lines: 5
                },
                layout: function(make, view) {
                  make.left.equalTo(view.prev.right).offset(10);
                  make.centerY.equalTo(view.super);
                  make.right.inset(10);
                }
              }
            ],
            data: [] // 初始化为空数据
          },
          layout: $layout.fill,
          events: {
            didSelect: function(sender, indexPath, data) {
              tiaozhuan(data.id);
              
             
            }
          }
        }
      ]
    }
  ]
});
}

// 定义一个函数来更新列表数据
function updateSongList(gtshuju) {
  var shuju = [];

      const data = gtshuju.data;
      data.forEach((item) => {
        //console.log(item.id)
        $http.post({
          url: url,
          header: headers,
          body: `channelId=${item.id}&channelCode=475dae8bb7684dfaa790615e2ae90741`,
          handler: function(resp) {
            
            const data = resp.data;
            if (data.data.code == 0) {
              var xinxi = data.data.cfModel;
              var zongshu = xinxi.amount;
              var shiyong = xinxi.bindTotal;
              var shengyu = zongshu - shiyong;
              var dianpu = xinxi.businessName;
              var liexing = xinxi.name;
              var guanli = xinxi.creatorName;
              var zhuangtai = "";
              var tishi = "";
              if (shengyu >= 1 && shengyu <= 50) {
               zhuangtai = "🔴";
               tishi = "<库存告急‼️>";
              } else if (shengyu >= 51 && shengyu <= 150) {
                zhuangtai = "🟡";
                   
               }else {
                 zhuangtai = "🟢";
                  
              }
               
              
              shuju.push({
                cover: {
                  src: xinxi.businessLogo
                },
                songInfo: {
                  text: `${zhuangtai}${dianpu} •总数量:${zongshu}张\n优惠卷剩余数量:${shengyu}张${tishi}\n优惠类型:${liexing}-管理员:${guanli}`
                },
                id :item.id
              });
              
              // 更新列表数据
              $("songList").data = shuju;
              $("songList").reload();
            }
          }
        });
      });
}
function tiaozhuan(id) {
var base = "q=https://dsf.etcp.cn/merchantH5/dynamicVoucher?params="+$text.base64Encode(`channelId=${id}&channelCode=475dae8bb7684dfaa790615e2ae90741`);

var body_data = {
   "appId": "wxc07f9d67923d676d",
   "env": "release",
   "path": "pages/voucher/take-coupon/main",
   "query": base
 };
 
 $http.post({
              url:url3,
              header: headers3,
              body: body_data,
             handler: function (resp) {
                 $ui.loading(false);
                 var gowx = resp.data.data;
             $app.openURL(gowx)
              $push.schedule({
                   title: "跳转微信成功！请享用优惠减免",
                   body: "by 中车大神",
                   delay: 1
                 });
             
             
         }
     })
}

// 调用函数来更新列表数据
zhongcheLoading()

async function get_updata() {
	const resp = await $http.get(github+"https://raw.githubusercontent.com/Q39547190/QXG/refs/heads/main/tingche.js");
	if (resp.response.statusCode === 200) {
		if (resp.data.version != "1.0.2") {
			$ui.alert({
				title: "发现新版本 - " + resp.data.version,
				message: resp.data.upexplain,
				actions: [{
					title: "立即更新",
					handler: function() {
						download(resp.data.updata, resp.data.name)
					}
				},
				{
					title: "取消"
				}]

			});

		} else {
			let today = new Date().toLocaleDateString();
			console.log(today);
			let key = "dismissedAt";

			let dismissedAt = $cache.get(key);

			if (dismissedAt != today) {
				$ui.alert({
					title: "公告",
					message: resp.data.Bulletin,
					actions: [{
						title: "进入软件",
						handler: function() {
							// 在这里添加进入软件的代码
						}
					},
					{
						title: "今天不再提示",
						handler: function() {
							$cache.set(key, today);
						}
					}]
				});
			}
			//..
		}
		//..
	}
}

function download(url, name) {
	$ui.toast("正在安装中 ...");
	$http.download({
		url: url,
		handler: function(resp) {
			$addin.save({
				name: name,
				icon: "tram.fill",
				data: resp.data,
				handler: function() {
					$ui.alert({
						title: "安装完成",
						message: "\n是否打开？\n" + name,
						actions: [{
							title: "打开",
							handler: function() {
								$app.openExtension(name)
							}
						},
						{
							title: "不了"
						}]
					});
				}
			})
		}
	})
}