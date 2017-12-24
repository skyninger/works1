<template>
<section>
    <h1 class="title">{{str_title}}</h1>
    <div class="desc">轻松的{{str_week}}，去一个陌生的小站散散心吧~</div>
    <div class="pic-hscroll-box">
        <div class="pic" v-for="(obj,index) in arr_data" :key="index" :style="{'background-image': 'url('+obj.pic+')'}">
            <div class="txt">{{obj.title}}</div>
        </div>
    </div>
    <h2 class="title"><span @click="funDefaultSeach">用户搜索</span> <input type="text" class="input-search" v-model="input_search" placeholder="搜索关键字" @blur="asynResult" /></h2>
    <div class="pic-user-box">
        <div class="user-box" v-for="(obj, index) in arr_weibo_user" :key="index" @click="weiboUid=obj.uid; weiboContainerid=''; initWeibo();">
            <img :src="obj.pic" alt="">
            <div class="sname">{{obj.name}}</div>
        </div>
    </div>
    <h2 class="title">本周热门 <small @click="initWeibo">{{is_load_refresh?'刷新中...':'点我刷新'}}</small></h2>
    <ul class="news-list">
        <li v-for="(obj, index) in arr_weibo" :key="index" v-if="obj.mblog">
            <div class="pic">
                <img :src="fetchWeiboPic(obj)" alt="">
                <div class="time">{{obj.mblog.created_at}}</div>
            </div>
            <div class="head-pic">
                <img :src="obj.mblog.user.avatar_hd" alt="">
                <span class="sname">{{obj.mblog.user.screen_name}}</span>
                <span class="zan">{{obj.mblog.attitudes_count}}次点赞</span>
            </div>
            <div class="desc-box" v-html="getWeiboData(obj, 'text')" @click="fetchWeiboText(getWeiboData(obj, 'id'), index, getWeiboData(obj, 'text').indexOf('全文')>-1, getWeiboData(obj, 'bool'))" :style="{'-webkit-line-clamp': obj.intRow?parseInt(obj.intRow):3}"></div>
            <div class="tags-box">
                <span>{{obj.mblog.source?obj.mblog.source:'来源不明'}}</span>
            </div>
        </li>
    </ul>
    <div class="newslist-more" @click="funNextPage">{{is_load_list?'加载中':'点我加载'}}</div>
</section>
</template>

<script>
export default {
    name: 'Main',
    data () {
        let nowdate=new Date(),
            mymonth=nowdate.getMonth()+1,
            mydate=nowdate.getDate(),
            myday=nowdate.getDay(),
            arr_week=['周日','周一','周二','周三','周四','周五','周六'];
        return {
            str_title: `${mymonth}月${mydate}日`,
            str_week: arr_week[myday],
            arr_data:[],
            arr_weibo: [],
            obj_page: {},
            weiboUid: '2803301701',
            weiboContainerid: '',
            input_search: '',
            arr_weibo_user: [
                {uid: '2803301701', pic: 'http://tva1.sinaimg.cn/crop.0.3.1018.1018.180/a716fd45gw1ev7q2k8japj20sg0sg779.jpg', name: '人民日报'},
                {uid: '2656274875', pic: 'http://tva2.sinaimg.cn/crop.0.0.512.512.180/9e5389bbjw8eylgqjhrzsj20e80e8jrw.jpg', name: '央视新闻'},
                {uid: '5806652887', pic: 'http://tvax4.sinaimg.cn/crop.0.71.111.111.180/006kY7FJly8fj1x7iul0jj305k05kq3p.jpg', name: '智慧妈妈'},
                {uid: '3673109167', pic: 'http://tva1.sinaimg.cn/crop.0.0.2048.2048.180/daef32afjw8eudmtf9wy8j21kw1kwh1j.jpg', name: '海宁天气'},
                {uid: '1831157632', pic: 'http://tvax1.sinaimg.cn/crop.166.3.333.333.180/6d253f80ly8fdarvbs69jj20go09dmyb.jpg', name: '美剧吧官博'}
            ],
            is_load_list: false,
            is_load_refresh: false
        }
    },
    methods: {
        funDefaultSeach(){
            this.input_search='';
            this.arr_weibo_user=[
                {uid: '2803301701', pic: 'http://tva1.sinaimg.cn/crop.0.3.1018.1018.180/a716fd45gw1ev7q2k8japj20sg0sg779.jpg', name: '人民日报'},
                {uid: '2656274875', pic: 'http://tva2.sinaimg.cn/crop.0.0.512.512.180/9e5389bbjw8eylgqjhrzsj20e80e8jrw.jpg', name: '央视新闻'},
                {uid: '5806652887', pic: 'http://tvax4.sinaimg.cn/crop.0.71.111.111.180/006kY7FJly8fj1x7iul0jj305k05kq3p.jpg', name: '智慧妈妈'},
                {uid: '3673109167', pic: 'http://tva1.sinaimg.cn/crop.0.0.2048.2048.180/daef32afjw8eudmtf9wy8j21kw1kwh1j.jpg', name: '海宁天气'},
                {uid: '1831157632', pic: 'http://tvax1.sinaimg.cn/crop.166.3.333.333.180/6d253f80ly8fdarvbs69jj20go09dmyb.jpg', name: '美剧吧官博'}
            ];
        },
        funNextPage(){
            if(this.is_load_list) return false;
            this.is_load_list=true;
            this.asynWeibo(this.weiboUid, this.obj_page.page, response=>{
                this.arr_weibo=[...this.arr_weibo, ...response.data.data.cards];
                this.obj_page=response.data.data.cardlistInfo;
                this.is_load_list=false;
            });
        },
        asynResult(){
            let str_search=this.input_search,
                arr_data=[];
            /* this.$http.get(`http://s.weibo.com/user/${str_search}`).then(response=>{ */
            this.$ajax(`http://s.weibo.com/user/${str_search}`, {}, response=>{
                const str_html=response.data;
                let _document=this.$_glo.parseDom(str_html,true),
                    _list=_document.querySelectorAll('.item_con');
                _list.forEach(obj=>{
                    let str_link=this.$_glo.getDomText('.star_pic a::href',obj).text(),
                        arr_link=str_link.split('/');
                    arr_data.push({
                        uid: arr_link[arr_link.length-1],
                        pic: this.$_glo.getDomText('.star_pic img::src',obj).text(),
                        name: this.$_glo.getDomText('.s_name',obj).text()
                    });
                });
                this.arr_weibo_user=arr_data;
            });
        },
        getWeiboData(data, name){
            const obj_data=data;
            let out_data='';
            if(name=='text'){
                if(obj_data.mblog.text && obj_data.mblog.text!='转发微博'){
                    out_data=obj_data.mblog.text;
                }else if(obj_data.mblog.retweeted_status){
                    out_data='['+obj_data.mblog.retweeted_status.created_at+']'+obj_data.mblog.retweeted_status.user.screen_name+'：'+obj_data.mblog.retweeted_status.text;
                }else{
                    out_data='无数据';
                }
            }else if(name=='id'){
                if(obj_data.mblog.text && obj_data.mblog.text!='转发微博'){
                    out_data=obj_data.mblog.id;
                }else if(obj_data.mblog.retweeted_status){
                    out_data=obj_data.mblog.retweeted_status.id;
                }else{
                    out_data=obj_data.mblog.id;
                }
            }else if(name=='bool'){
                if(obj_data.mblog.text && obj_data.mblog.text!='转发微博'){
                    return false;
                }else if(obj_data.mblog.retweeted_status){
                    return true;
                }else{
                    return false;
                }
            }
            return out_data;
        },
        fetchWeiboText(id, index, bool=false, isRetweeted=false){
            let str_id=id;
            if(this.arr_weibo[index].intRow==100){
                this.$set(this.arr_weibo[index], 'intRow', 3);
            }else{
                if(bool){
                    /* this.$http.get('https://m.weibo.cn/statuses/extend',{
                        params: {
                            id: str_id
                        }
                    }).then(response=>{ */
                    this.$ajax('https://m.weibo.cn/statuses/extend', {
                        id: str_id
                    }, response=>{
                        const obj_data=response.data;
                        let str_longtext=obj_data.data.longTextContent;
                        if(isRetweeted){
                            let obj_data=this.arr_weibo[index];
                            str_longtext='['+obj_data.mblog.retweeted_status.created_at+']'+obj_data.mblog.retweeted_status.user.screen_name+'：'+str_longtext;
                        }
                        this.$set(this.arr_weibo[index].mblog, 'text', str_longtext);
                        this.$set(this.arr_weibo[index], 'intRow', 100);
                    });
                }else{
                    this.$set(this.arr_weibo[index], 'intRow', 100);
                }
            }
        },
        fetchWeiboPic(data){
            let obj_data=data,
                str_pic='';
            if(obj_data.mblog.page_info){
                str_pic=obj_data.mblog.page_info.page_pic.url;
            }else if(obj_data.mblog.thumbnail_pic){
                str_pic=obj_data.mblog.thumbnail_pic;
            }else if(obj_data.mblog.retweeted_status){
                str_pic=obj_data.mblog.retweeted_status.thumbnail_pic?obj_data.mblog.retweeted_status.thumbnail_pic:obj_data.mblog.user.cover_image_phone;
            }else{
                str_pic=obj_data.mblog.user.cover_image_phone;
            }
            return str_pic;
        },
        asynWeibo(uid, page, callback){
            let str_uid=uid,
                int_page=parseInt(page),
                funWeibo=(objpost, bool=false)=>{
                /* this.$http.get('https://m.weibo.cn/api/container/getIndex',{
                    params: objpost
                }).then(response=>{ */
                this.$ajax('https://m.weibo.cn/api/container/getIndex', objpost, response=>{
                    if(bool){
                        callback(response);
                    }else{
                        const obj_data=response.data;
                        this.weiboContainerid=obj_data.data.tabsInfo.tabs[1].containerid;
                        funWeibo({
                            type: 'uid',
                            value: str_uid,
                            containerid: obj_data.data.tabsInfo.tabs[1].containerid,
                            page: int_page
                        }, true);
                    }
                });
            };
            if(this.weiboContainerid){
                funWeibo({
                    type: 'uid',
                    value: str_uid,
                    containerid: this.weiboContainerid,
                    page: int_page
                }, true);
            }else{
                funWeibo({
                    type: 'uid',
                    value: str_uid
                });
            }
        },
        asynSohu(){
            /* this.$http.get('http://news.sohu.com/',{
                headers: {
                    'xasd':'asd'
                },
            }).then(response=>{ */
            this.$ajax('http://news.sohu.com/', {}, response=>{
                const str_data=response.data;
                let _document=this.$_glo.parseDom(str_data,true),
                    _li=_document.querySelectorAll('.mp-focus-content .swiper-slide');
                //console.log(str_data);
                let arr_data=[];
                _li.forEach(obj=>{
                    arr_data.push({
                        title: this.$_glo.getDomText('.focus-item__info__text',obj).text(),
                        pic: this.$_glo.getDomText('img::src',obj).text('https://wx3.sinaimg.cn/crop.125.0.749.562.240/8a533d85ly1fmpemfkzq2j20rs0fm77p.jpg')
                    });
                });
                //console.log(arr_data);
                this.arr_data=arr_data;
            });
        },
        initWeibo(){
            if(this.is_load_refresh) return false;
            this.is_load_refresh=true;
            this.asynWeibo(this.weiboUid, 1, response=>{
                this.arr_weibo=response.data.data.cards;
                this.obj_page=response.data.data.cardlistInfo;
                this.is_load_refresh=false;
            });
        },
        plusReady(){
            plus.key.addEventListener( "backbutton", function(){
                plus.nativeUI.confirm( "确认退出小帮手？", function(e){
                    if(e.index==0){
                        plus.runtime.quit();
                    }else{
                        var w=plus.webview.all();
                        for(var i=1;i<w.length;i++){
                            //alert(w[i].getURL());
                            plus.webview.close(w[i]);
                        }
                    }
                }, "提示", ["确认","返回功能大全"] );
            }, false );
            this.is_load_refresh=false;
            this.is_load_list=false;
            this.asynSohu();
            this.initWeibo();
        }
    },
    mounted(){
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",this.plusReady,false);
            this.asynSohu();
            this.initWeibo();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import (reference) url('../assets/css/public.less');
    h1.title{
        font-size: 28px;
        margin: 10px 0;
        font-weight: 400;
        padding: 0 15px;
    }
    .desc{
        font-size: 14px;
        color: @color-deepgray;
        padding: 0 15px;
    }
    .pic-hscroll-box{
        margin: 20px 0;
        height: 250px;
        white-space: nowrap;
        padding: 0 15px 0 0;
        overflow-y: hidden;
        overflow-x: auto;
        .pic{
            display: inline-block;
            .size(240px, 250px);
            border-radius: 10px;
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            box-shadow: inset 0 0 9px 0 rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
            margin-left: 15px;
            .txt{
                position: absolute;
                width: 100%;
                left: 0;
                bottom: 0;
                color: @color-white;
                padding: 0 10px 10px;
                box-shadow: inset 0 -30px 30px 0 rgba(0,0,0,0.4);
                white-space: normal;
            }
        }
    }
    h2.title{
        font-size: 22px;
        margin: 10px 0;
        font-weight: 400;
        padding: 0 15px;
        small{
            .pull-right;
            color: @color-gray;
            font-size: 12px;
            line-height: 22px;
        }
        .input-search{
            height: 26px;
            line-height: 26px;
            .pull-right;
            width: 100px;
            border-radius: 22px;
            border: 1px solid @color-grey;
            padding: 0 5px;
            font-size: 12px;
            .text-center;
            outline: none;
        }
    }
    ul.news-list{
        margin: 20px 0;
        padding: 0 15px;
        li{
            padding: 0 100px 0 0;
            margin: 0 0 30px;
            .pic{
                float: right;
                width: 90px;
                margin-right: -100px;
                img{
                    .size(85px, 85px);
                    border-radius: 5px;
                }
                .time{
                    font-size: 12px;
                    color: @color-gray;
                    .text-right;
                    margin: 8px 0 0;
                }
            }
            .head-pic{
                font-size: 12px;
                color: @color-gray;
                img{
                    display: inline-block;
                    .size(20px, 20px);
                    border-radius: 100%;
                    vertical-align: middle;
                }
                .sname{
                    margin-left: 5px;
                }
                .zan{
                    .pull-right;
                }
            }
            .desc-box{
                font-size: 14px;
                margin: 5px 0;
                line-height: 22px;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 64px;
                /deep/ .url-icon img{
                    display: inline-block;
                    .size(20px, 20px);
                    vertical-align: middle;
                    margin-right: 4px;
                }
            }
            .tags-box{
                font-size: 12px;
                margin: 8px 0 0;
                span{
                    display: inline-block;
                    height: 22px;
                    padding: 0 10px;
                    line-height: 22px;
                    background-color: #642f2f;
                    color: @color-white;
                    border-radius: 22px;
                }
            }
        }
    }
    .pic-user-box{
        margin: 10px 0 20px;
        height: 85px;
        white-space: nowrap;
        padding: 0 15px 0 0;
        overflow-y: hidden;
        overflow-x: auto;
        .user-box{
            display: inline-block;
            margin-left: 20px;
            .text-center;
            .size(60px, 60px);
            img{
                display: block;
                .size(60px, 60px);
                border-radius: 100%;
            }
            .sname{
                font-size: 12px;
                margin: 6px 0;
                color: @color-deepgray;
            }
        }
    }
    .newslist-more{
        .text-center;
        font-size: 12px;
        padding: 0 0 25px;
        color: @color-gray;
    }
</style>

