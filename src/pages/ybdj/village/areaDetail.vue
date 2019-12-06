<route-meta>
{
  "requiresAuth": true,
  "name":"村情简介",
  "parent":"首页"
}
</route-meta>
<template>
    <div class="content" id="villagePact">
        <el-form label-width="160px" :model="areaInfo" :disabled="dis" id="checkScreen"
            :rules="rules" ref="addQuery">
            <el-row>
                <el-col :span='18'>
                    <el-form-item label="村情简介" prop="info">
                        <el-input type="textarea" :rows="6" v-model="areaInfo.info" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="el-divider el-divider--horizontal"></div>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="功能结构模型" prop="structureType">
                        <el-select v-model="areaInfo.structureType" clearable filterable placeholder="请选择功能结构模型">
                            <v-yvoption groupName="structureType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="文明村类型" prop="cultureType">
                        <el-select v-model="areaInfo.cultureType" clearable filterable placeholder="非文明村不填">
                            <v-yvoption groupName="cultureType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="四好村类型" prop="fourGoodType">
                        <el-select v-model="areaInfo.fourGoodType" clearable filterable placeholder="非四好村不填">
                            <v-yvoption groupName="fourGoodType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="脱贫年度" prop="overcomePovertyYear">
                        <el-input v-model="areaInfo.overcomePovertyYear" placeholder="例如:2018" auto-complete="off">
                            <template slot="append">年</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="是否乡村振兴示范村" prop="isProsperModel">
                        <el-checkbox v-model="areaInfo.isProsperModel" :true-label="1" :false-label="0"></el-checkbox>
                    </el-form-item>
                </el-col>
                
            </el-row>
            <el-row>
            <el-col :span='8'>
                    <el-form-item label="贫困村类型" prop="povertyType">
                        <el-select v-model="areaInfo.povertyType" clearable filterable placeholder="非贫困村不填">
                            <v-yvoption groupName="povertyType"></v-yvoption>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="areaInfo.povertyType">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="帮扶力量" name="1">
                    <div v-if="areaInfo.povertyType==1">
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="贫困村联系区领导" prop="povertyCountyLeaderName">
                                <el-input v-model="areaInfo.povertyCountyLeaderName" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='8'>
                            <el-form-item label="帮扶单位" prop="povertySupportUnit">
                                <el-input v-model="areaInfo.povertySupportUnit" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="第一书记" prop="povertyFirstSecretaryName">
                                <el-input v-model="areaInfo.povertyFirstSecretaryName" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='8'>
                            <el-form-item label="驻村工作组成员" prop="povertyResidencyMembers">
                                <el-input v-model="areaInfo.povertyResidencyMembers" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="驻村农技员" prop="povertyAgricultureAgent">
                                <el-input v-model="areaInfo.povertyAgricultureAgent" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </div>
                    <div v-if="areaInfo.povertyType==2">
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="第一书记" prop="povertyFirstSecretaryName">
                                <el-input v-model="areaInfo.povertyFirstSecretaryName" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='8'>
                            <el-form-item label="农业技术巡回服务小组" prop="povertyAgricultureRovingGroup">
                                <el-input v-model="areaInfo.povertyAgricultureRovingGroup" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='8'>
                            <el-form-item label="结对帮扶责任人" prop="povertySupportResponsiblePerson">
                                <el-input v-model="areaInfo.povertySupportResponsiblePerson" auto-complete="off">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </div>
                </el-collapse-item>
            </el-collapse>
            </el-row>
            <div class="el-divider el-divider--horizontal"></div>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="面积" prop="proportion">
                        <el-input type="number" v-model="areaInfo.proportion" auto-complete="off">
                            <template slot="append">平方公里</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="村民小组" prop="smallGroupCount">
                        <el-input type="number" v-model="areaInfo.smallGroupCount" auto-complete="off">
                            <template slot="append">个</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="人口" prop="populationCount">
                        <el-input type="number" v-model="areaInfo.populationCount" auto-complete="off">
                            <template slot="append">人</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="户数" prop="familyCount">
                        <el-input type="number" v-model="areaInfo.familyCount" auto-complete="off">
                            <template slot="append">户数</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="主要产业" prop="mainIndustry">
                        <el-input v-model="areaInfo.mainIndustry" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="产业规模" prop="industryScale">
                        <el-input type="number" v-model="areaInfo.industryScale" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="主要产业年产值" prop="mainIndustryYearValue">
                        <el-input type="number" v-model="areaInfo.mainIndustryYearValue" auto-complete="off">
                            <template slot="append">万元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <div class="el-divider el-divider--horizontal"></div>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="安全饮水通户率" prop="waterPassPercent">
                        <el-input type="number" v-model="areaInfo.waterPassPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="电力通户率" prop="electricPassPercent">
                        <el-input type="number" v-model="areaInfo.electricPassPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="燃气通户率" prop="gasPassPercent">
                        <el-input type="number" v-model="areaInfo.gasPassPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="道路通户率" prop="roadPassPercent">
                        <el-input type="number" v-model="areaInfo.roadPassPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="通讯通户率" prop="telePassPercent">
                        <el-input type="number" v-model="areaInfo.telePassPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="村道硬化率" prop="roadHardenPercent">
                        <el-input type="number" v-model="areaInfo.roadHardenPercent" auto-complete="off">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="村主道宽度" prop="mainRoadWidth">
                        <el-input type="number" v-model="areaInfo.mainRoadWidth" auto-complete="off">
                            <template slot="append">米</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="el-divider el-divider--horizontal"></div>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="联系区领导" prop="countyLeaderName">
                        <el-input v-model="areaInfo.countyLeaderName" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系区领导职务" prop="countyLeaderTitle">
                        <el-input v-model="areaInfo.countyLeaderTitle" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系区领导电话" prop="countyLeaderPhone">
                        <el-input v-model="areaInfo.countyLeaderPhone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="联系镇领导" prop="townshipLeaderName">
                        <el-input v-model="areaInfo.townshipLeaderName" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇领导职务" prop="townshipLeaderTitle">
                        <el-input v-model="areaInfo.townshipLeaderTitle" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇领导电话" prop="townshipLeaderPhone">
                        <el-input v-model="areaInfo.townshipLeaderPhone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="联系镇干部1" prop="townshipCadre1Name">
                        <el-input v-model="areaInfo.townshipCadre1Name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部1职务" prop="townshipCadre1Title">
                        <el-input v-model="areaInfo.townshipCadre1Title" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部1电话" prop="townshipCadre1Phone">
                        <el-input v-model="areaInfo.townshipCadre1Phone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="联系镇干部2" prop="townshipCadre2Name">
                        <el-input v-model="areaInfo.townshipCadre2Name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部2职务" prop="townshipCadre2Title">
                        <el-input v-model="areaInfo.townshipCadre2Title" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部2电话" prop="townshipCadre2Phone">
                        <el-input v-model="areaInfo.townshipCadre2Phone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span='8'>
                    <el-form-item label="联系镇干部3" prop="townshipCadre3Name">
                        <el-input v-model="areaInfo.townshipCadre3Name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部3职务" prop="townshipCadre3Title">
                        <el-input v-model="areaInfo.townshipCadre3Title" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="联系镇干部3电话" prop="townshipCadre3Phone">
                        <el-input v-model="areaInfo.townshipCadre3Phone" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span='8'>
                    <el-form-item label="村貌图片" prop="picUrl">
                        <imgUpDate :imageUrl="areaInfo.picUrlAccess" :dis='dis' v-model="areaInfo.picUrl"
                            @accessImageChange="picUrlAccessChange"></imgUpDate>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="产业图片" prop="industryPic">
                        <imgUpDate :imageUrl="areaInfo.industryPicAccess" :dis='dis' v-model="areaInfo.industryPic"
                            @accessImageChange="industryPicAccessChange"></imgUpDate>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="村道图片" prop="roadPic">
                        <imgUpDate :imageUrl="areaInfo.roadPicAccess" :dis='dis' v-model="areaInfo.roadPic"
                            @accessImageChange="roadPicAccessChange"></imgUpDate>
                    </el-form-item>
                </el-col>
                
            </el-row>
        </el-form>
        <el-col :span="24" style="text-align: center;padding-bottom: 20px;">
                    <el-button type="primary" v-if='!dis' @click="save">保 存</el-button>
                    <el-button v-if='!dis' @click="cancel">取 消</el-button>
                    <el-button type="primary" v-else @click="update">修 改</el-button>
                </el-col>
    </div>

</template>

<script>
    import {
        getAreaInfo,
        // putAreaInfo,
    } from '../../../api/villageApi';
    import imgUpDate from "../../../components/common/imgUpDate";
    import vYvoption from "../../../components/common/yvoption.vue";
    import imgsUpload from "../../../components/common/imgsUpload.vue";

    const code = '200';
    export default {
        layout:'home',
        data() {
            return {
                dis:true,
                activeNames: '1',
                areaInfo: {
                    id: '',
                    level: '6',
                    name: '',
                    parentId: '',
                    longitude: '',
                    latitude: '',
                    info: '',
                    structureType: '',
                    cultureType: '',
                    fourGoodType: '',
                    overcomePovertyYear: '',
                    povertyType: '',
                    povertyCountyLeaderName: '',
                    povertyFirstSecretaryName: '',
                    povertyAgricultureAgent: '',
                    povertySupportUnit: '',
                    povertyResidencyMembers: '',
                    povertyAgricultureRovingGroup: '',
                    isProsperModel: '',
                    proportion: '',
                    smallGroupCount: '',
                    populationCount: '',
                    familyCount: '',
                    mainIndustry: '',
                    industryScale: '',
                    mainIndustryYearValue: '',
                    waterPassPercent: '',
                    electricPassPercent: '',
                    gasPassPercent: '',
                    roadPassPercent: '',
                    telePassPercent: '',
                    roadHardenPercent: '',
                    mainRoadWidth: '',
                    countyLeaderName: '',
                    countyLeaderTitle: '',
                    countyLeaderPhone: '',
                    townshipLeaderName: '',
                    townshipLeaderTitle: '',
                    townshipLeaderPhone: '',
                    townshipCadre1Name: '',
                    townshipCadre1Title: '',
                    townshipCadre1Phone: '',
                    townshipCadre2Name: '',
                    townshipCadre2Title: '',
                    townshipCadre2Phone: '',
                    townshipCadre3Name: '',
                    townshipCadre3Title: '',
                    townshipCadre3Phone: '',
                    picUrl: '',
                    picUrlAccess: '',
                    roadPic: '',
                    roadPicAccess: '',
                    industryPic: '',
                    industryPicAccess: '',
                    checkStatus: '',
                    createTime: '',
                    isDeleted: '',
                },
                rules: {},
            }
        },
        methods: {
            cancel() {
                this.getSearchList()
                this.dis = true;
            },
            update() {
                this.dis = false;
            },
            save(val) {
                this.$refs["addQuery"].validate((valid) => {
                    if (valid) {

                        putAreaInfo(this.areaInfo).then((res) => {
                            if (res.data.code == code) {
                                this.$message({
                                    type: 'success',
                                    message: res.data.message
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message
                                })
                            }

                        }).catch(() => {
                            this.$message({
                                type: 'error',
                                message: '保存失败，请稍后重试或联系管理员！！'
                            })
                        })
                    }
                })
            },

            picUrlAccessChange(val) {
                this.areaInfo.picUrlAccess = val
            },
            industryPicAccessChange(val) {
                this.areaInfo.industryPicAccess = val
            },
            roadPicAccessChange(val) {
                this.areaInfo.roadPicAccess = val
            },
            getSearchList(){
                getAreaInfo({}).then((res) => {
                if (res.data.code == code) {
                    this.areaInfo = res.data.data
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.message
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'error',
                    message: '网络异常，请稍后重试或联系管理员！！'
                })
            })
            }

        },
        components: {
            imgUpDate,
            vYvoption,
            imgsUpload
        },

        mounted() {
            this.getSearchList();
        },
    }

</script>

<style>
    #joinUs .w-e-text-container {
        height: 800px !important;
    }

    #joinUs #editor {
        height: 850px !important;
    }

    #villagePact .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    #villagePact .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        border-color: #e4e7ed;
        color: #20192e;
        cursor: not-allowed;
    }

    .el-divider--horizontal {
        display: block;
        height: 1px;
        width: 100%;
        margin: 24px 0;
    }

    .el-divider {
        background-color: #dcdfe6;
        position: relative;
    }

</style>
