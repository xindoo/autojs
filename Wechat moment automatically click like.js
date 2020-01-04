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
        toast("脚本手动退出");
        exit();
    });
}

function prepare() {
    // 双击顶部更新朋友圈  
    click(500, 150);
    sleep(100);
    click(500, 150); 

    // 等2s 微信朋友圈更新完成 
    sleep(3000);

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
    sleep(1000);
    var image = captureScreen();
    var arrs = [-1];
    var x = 991;
    var buttonColor = -11048043;

    // 函数返回此次点赞是否成功，如果没找到点赞按钮或者已点赞返回false，做法是否继续的判断
    var isSucceed = true;

    // 扫描出点赞评论按钮的位置，两个点的ARGB颜色为-11048043 
    for(var y = 250; y < 1920; y++) {
        var color = images.pixel(image, x, y);

        // 白色 背景色，跳过
        if (color == -1) {
            continue;
        }
        if (color == buttonColor) {
            // 按下评论点赞按钮  
            click(x, y)
            sleep(1000);

            // 重新截图，找到点赞心形按钮的位置
            var clickimage = captureScreen();

            // 如果这个点的颜色是-1，表示这条朋友圈已经点过赞了，返回点赞失败false
            if (images.pixel(clickimage, 496, y) != -1) {
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

    // 如果执行到这，可能是某条朋友圈评论太多，一屏里没有点赞评论按钮，就滑动大半屏再试一次
    swipe(550, 1600, 550, 150, 200);
    return false;
}

//程序主入口
function start(){ 
    //注册音量键上被按下时退出脚本的执行  
    registEvent();

    // 确保进入微信朋友圈
    enterWechatMoment();
    prepare();
    
    var retry = 3;
    var cnt = 0;
    // 连续失败三次就退出  
    while(retry > 0) {
        // 如果是false，表示已经点过赞了 
        if (clickLike() == false) {
            retry--;
        } else {
            retry = 3;
            cnt++;
        }
    }
    
    toast("本次总共点赞" + cnt + "条");
    // 返回微信主界面
    click(50,140);
    exit();
}
start();