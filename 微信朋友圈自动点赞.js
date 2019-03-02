function enterWechatMoment() {
    app.launch("com.tencent.mm");
    //确保返回到微信主界面
    sleep(200);
    click(692,2073);

    // 连续按多次返回，确保回到网协主界面 
    for (var i = 0; i < 5; i++) {
        click(50,140);
        sleep(100);
    }

    sleep(50);
    // 点微信 发现
    click(692,2073);
    sleep(50);

    // 点朋友圈入口
    click(500,300);
    sleep(1000);
}

function registEvent() {
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("volume_down", function(event){
        tLog("脚本手动退出");
        exit();
    });
}

function prepare() {
    // 双击顶部更新朋友圈  
    click(500, 150);
    sleep(100);
    click(500, 150); 

    // 等2s 微信朋友圈更新完成 
    sleep(2000);

    // 向下滑至第一条朋友圈 
    swipe(550, 1200, 550, 200, 200);
    
    if(!requestScreenCapture()){
        tLog("请求截图失败");
        exit();
    }
    var image = captureScreen();
    sleep(2000);
}

function clickLike() {
    if(!requestScreenCapture()){
        tLog("请求截图失败");
        exit();
    }
    sleep(1000);
    var image = captureScreen();
    var arrs = [-1];
    var x = 991;
    var defalutColor = -11048043;

    // 扫描出点赞评论按钮的位置，两个点的ARGB颜色为-11048043 
    var isSucceed = true;
    for(var y = 250; y < 1920; y++) {
        var color = images.pixel(image, x, y);

        // 背景色，跳过
        if (color == -1) {
            continue;
        }
        if (color == defalutColor) {
            click(x, y)
            sleep(1000);
            var clickimage = captureScreen();

            // 如果这个点的颜色是-1，表示这条朋友圈已经点过赞了，返回点赞失败false
            if (images.pixel(clickimage, 465, y) != -1) {
                // 点赞
                click(523, y);
            } else {
                isSucceed = false;
            }
            sleep(2000);
            // 往下滑动到下一条朋友圈的位置  
            swipe(550, y+200, 550, 150, 200);
            return isSucceed;
        }
    }
}

//程序主入口
function start(){
    //注册音量下按下退出脚本监听
    registEvent();
    // toast("hello world");
    enterWechatMoment();
    prepare();
    var cnt = 0;
    while(true) {
        // 如果是false，表示已经点到上次点赞的位置了，结束
        if (clickLike() == false) {
            cnt++;
        }
        if (cnt > 2) {
            break;
        }
    }
    // 返回微信主界面
    click(50,140);
    exit();
}
start();