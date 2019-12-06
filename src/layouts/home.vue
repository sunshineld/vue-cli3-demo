<template>
    <div class="wrapper"  id="authorTop">
        <el-container>
            <el-aside width="249px">
                <v-sidebar :collapse="collapse" ></v-sidebar>
            </el-aside>
            <el-container>
                <el-header class="myHeader" :style="getStyle"><v-head :collapse="collapse" @onCollapse="onCollapse"></v-head></el-header>
                <div class="content_own" :style="getStyle">
                    <div style="margin:10px 40px">
                        <transition name="fade-transform" mode="out-in"><router-view></router-view></transition>
                    </div>
                </div>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import vHead from '../components/common/Header';
    import vSidebar from '../components/common/Sidebar.vue';
    export default {
        data(){
            return{
                collapse:true,
                tooltip:'收缩',
                icon:'el-icon-d-arrow-left'
            }
        },
        components:{
            vHead, vSidebar
        },
        computed:{
            getStyle(){
                if(this.collapse){
                    return '';
                }else{
                    return 'left:65px'
                }
            }
        },
        methods:{
            onCollapse(){
                this.collapse=!this.collapse;
                if(this.collapse){
                    this.tooltip='收缩';
                    this.icon='el-icon-d-arrow-left'
                }else{
                    this.tooltip='展开';
                    this.icon='el-icon-d-arrow-right'
                }
            },
        },
        beforeCreate:function(){
            if(typeof(this.$route.query.uid)!="undefined"){
                let resUid = JSON.parse(this.$route.query.uid);
                localStorage.setItem('user', JSON.stringify(resUid.userInfo));
                localStorage.setItem('voucher', resUid.voucher);
                this.$router.push('/readme');
            }

        },
    }
</script>
<style type="text/css">
    .collapse{
        cursor: pointer;
        width: 2em;
        margin: 10px 10px 10px 40px;
    }
    .el-container {
        width:100%;
        height: 100%;
    }
    .is-vertical {
        width: 100%;
    }
    .content_own{
        position: absolute;
        top: 60px;
        left: 250px;
        transition: all .3s;
        background: none repeat scroll 0 0 #fff;
        right: 0;
        width: auto;
        box-sizing: border-box;
        overflow-y: scroll;
        height:94%;
    }
    .el-dialog{
        width: 1000px;
    }
    .el-header{
        padding:0;
        height: 50px!important;
    }
    .main_toolbar{
        height: 58px;
        background-color: #f0f0f0;
	    box-shadow: 2px 2px 2px 0px
		rgba(34, 24, 21, 0.1);
        position: relative;
        margin-left: -250px;
        left:250px;
        transition: all .3s;
    }
    .myHeader{
        position: absolute;
        width: auto;
        left:250px;
        right: 0;
        transition: all .3s;
    }
    .p_style {
        width: 90%;
        word-break: break-all;
        word-wrap: break-word;
    }
    .a_style {
        color:#409eff;
        text-decoration:underline;
    }

    /* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.25s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
