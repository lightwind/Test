<template>
  <ant-modal
    :visible="open"
    :modal-title="formTitle"
    modalWidth="1680"
    modalHeight="750"
    @cancel="cancel"
    :maskClosable='false'
    class="ant-modal_box"
  >
    <div slot="content" style="display: flex;">
      <div class="formBox" v-if="typeStatus==1">
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="厂区" prop="plantAreaId">
            <a-select v-model="form.plantAreaId" placeholder="请选择" @change="plantChange()" allow-clear>
              <a-select-option v-for="(d, index) in factoryList" :key="index" :value="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="区域" prop="regionId">
            <a-tree-select
              v-model="form.regionId"
              :tree-data="regionList"
              placeholder="请选择"
              tree-default-expand-all
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :replaceFields="{children:'children',title:'name' ,key:'id',value: 'id' }"
              allow-clear
              @change="regionChange()"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="主控终端" prop="terminalId">
            <a-select v-model="form.terminalId" placeholder="请选择" @change="terminalChange()" allow-clear>
              <a-select-option v-for="(d, index) in masterList" :key="index" :value="d.id">
                {{ d.num }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item label="箱子编号" prop="boxId" v-show="form.terminalId">
            
          </a-form-model-item> -->
          <div v-show="form.terminalId" style="margin-left: 50px;">
            <div class="boxcon" v-if="boxnumList1.length>0 && boxnumList2.length>0">
              <ul class="box-box" v-if="boxnumList1.length>0">
                <li v-for="item in boxnumList1" class="box-list" :class="[item.bindStatus==1 ? 'active' : 'noactive', item.boxStatus == 0 ? 'red':'']">{{item.changeShowNum==undefined?item.showNum:item.changeShowNum}}</li>
              </ul>
              <ul class="box-box" v-if="boxnumList.length>0">
                <li v-for="item in boxnumList" class="box-list" :class="[item.bindStatus==1 && item.type!=1 ? 'active' : 'noactive', item.type==1?'box-list1':'',item.boxStatus == 0 ? 'red':''] ">{{item.changeShowNum==undefined?item.showNum:item.changeShowNum}}</li>
                <li class="boxlogo" v-if="boxnumList.length>0 && boxnumList[6].type == 1"></li>
              </ul>
              <ul class="box-box" v-if="boxnumList2.length>0">
                <li v-for="item in boxnumList2" class="box-list" :class="[item.bindStatus==1 ? 'active' : 'noactive', item.boxStatus == 0 ? 'red':'']">{{item.changeShowNum==undefined?item.showNum:item.changeShowNum}}</li>
              </ul>
            </div>
            <div class="boxcon" v-if="boxnumList1.length==0 && boxnumList2.length==0">
              <ul class="box-box44" v-if="boxnumList.length==44">
                
                <!-- 纵向渲染的第一个 li -->
                  <template v-for="(item, index) in boxnumList.slice(0, 5)">
                      <li :key="index"  :class="[item.bindStatus==1 && item.type!=1 ? 'active' : 'noactive', item.type==1?'box-list1':'',item.boxStatus == 0 ? 'red':''] ">{{ item.changeShowNum==undefined?item.showNum:item.changeShowNum }}</li>
                  </template>
                  <!-- 横向渲染的第二个到最后一个 li -->
                  <template v-for="(item, index) in boxnumList.slice(5)">
                      <li :key="index+5"  :class="[item.bindStatus==1 && item.type!=1 ? 'active' : 'noactive', item.type==1?'box-list1':'',item.boxStatus == 0 ? 'red':''] ">{{ item.changeShowNum==undefined?item.showNum:item.changeShowNum }}</li>
                  </template>
                  <!-- 特殊项，占据 (1,3) 到 (11,3) -->
                <li class="boxlogo44" ></li>
              </ul>
              <ul class="box-box60" v-if="boxnumList.length==60">
                <!-- 纵向渲染的第一个 li -->
                  <template v-for="(item, index) in boxnumList.slice(0, 6)">
                      <li :key="index"  :class="[item.bindStatus==1 && item.type!=1 ? 'active' : 'noactive', item.type==1?'box-list1':'',item.boxStatus == 0 ? 'red':''] ">{{ item.changeShowNum==undefined?item.showNum:item.changeShowNum }}</li>
                  </template>
                  <!-- 横向渲染的第二个到最后一个 li -->
                  <template v-for="(item, index) in boxnumList.slice(6)">
                      <li :key="index+6"  :class="[item.bindStatus==1 && item.type!=1 ? 'active' : 'noactive', item.type==1?'box-list1':'',item.boxStatus == 0 ? 'red':''] ">{{ item.changeShowNum==undefined?item.showNum:item.changeShowNum }}</li>
                  </template>
                <li class="boxlogo60" ></li>
              </ul>
            </div>
            <span>（蓝色表示当前箱子未分配，灰色表示已分配）</span>
          </div>
        </a-form-model>
      </div>
      <select-user ref="selectUser" :type="1"/>
    </div>
    <template slot="footer">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="batchsubmitForm">
        保存
      </a-button>
    </template>
  </ant-modal>
</template>
<script>
import PersonForm from './PersonForm'
export default {
  ...PersonForm
}
</script>
<style scoped>
.ant-modal_box >>> .ant-modal-body {
    overflow: unset !important;
    padding-top: 20px !important;
}
.item >>> .ant-form-item-label > label::after {
    content: '';
}
.item{
  margin: 0;
}
.iteminfo{
  height: 40px;
  line-height: 40px;
}
.iteminfo span{
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}
.iteminfo span::before{
  content: '';
  width: 5px;
  height: 5px;
  background: #2F54EB;
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px 0 20px;
  margin-top: -5px;
  vertical-align: middle;
}
 .boxcon{
    display: flex;
  }
  .box-box{
    display: flex;
    max-width: 208px;
    width: 208px;
    max-height: 342px;
    flex-wrap: wrap;
    background: #F2F2F2;
    padding: 19px 8px 11px 8px;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    margin-right: 20px;
  }
  .box-box60{
    display: grid;
            grid-auto-flow: column;
            grid-template-columns: repeat(6, 62px); /* 6列 */
            grid-template-rows: repeat(11, 50px); /* 11行 */
            gap: 1px;
            border: 1px solid #000;
            padding: 0;
            margin: 0;
            position: relative;
  }
  .box-box60 li{
    border: 1px solid #000;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
  }
  .boxlogo60{
    grid-column: 3 / span 2; /* 从第3列开始，占据2列 */
            grid-row: 3 / span 3; /* 从第3行开始，占据3行 */
            background-color: #2F54EB;
            background-image: url('../../../../assets/images/boxlogo.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  .box-box44{
    display: grid;
            grid-auto-flow: column;
            grid-template-columns: repeat(5, 62px); /* 5列 */
            grid-template-rows: repeat(11, 50px); /* 11行 */
            gap: 1px;
            border: 1px solid #000;
            padding: 0;
            margin: 0;
            position: relative;
  }
  .box-box44 li{
    border: 1px solid #000;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
  }
  .boxlogo44{
    grid-column: 3 / span 1; /* 占据第3列 */
    grid-row: 1 / span 11; /* 从第一行开始，占据11行 */
    background-color: #2F54EB;
            background-image: url('../../../../assets/images/boxlogo.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  .box-list{
    width: 62px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    margin: 1px;
  }
  .active{
    background: #D9D9D9;
    color: #9C9C9C;
  }
  .noactive{
    background: #2F54EB;
    color: #fff;
    cursor: pointer;
  }
  .activebox{
    background: #FFA500;
    color: #fff;
    cursor: pointer;
  }
  .red{
    background: #F16161 !important;
    color: #fff;
  }
  .box-list1{
    background: #F2F2F2;
    cursor: auto;
  }
  .boxlogo{
    width: 62px;
    height: 102px;
    background-color: #2F54EB;
    position: absolute;
    left: 73px;
    top: 20px;
    background-image: url('../../../../assets/images/boxlogo.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  .ant-modal-body{
    overflow: auto;
  }
  .formBox{
    min-width: 50%;
    width: 50%;
  }
</style>
