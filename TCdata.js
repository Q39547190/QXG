$ui.render({
  views: [{
    type: "label",
    props: {
      text: "漏洞全部失效😀",
      font: $font("bold", 20), // 
      textColor: $color("#333333"), // 
      align: $align.center, // 文字居中对齐
    },
    layout: function(make, view) {
      make.center.equalTo(view.super) // 
      make.width.equalTo(200) // 
      make.height.equalTo(30) // 
    }
  }]
})