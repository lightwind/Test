import {
  getSelectBoxRegionByPersonId,
  getPlant,
  savePerson,
  editPerson,
  selectBoxByCabNum,
  allotBox,
  terminalCondition,
  batchAllotBox,
  statusBoxNum,
} from '@/api/person/manage'
import { treeRegionList } from '@/api/region/region'
import { getDataList } from '@/api/cabinet/cabinet'
import { boxList, checkData } from '@/api/case/case'
import { checkBoxData } from '@/api/system/plant'
import { treeselect } from '@/api/system/dept'
import AntModal from '@/components/pt/dialog/AntModal'
import selectUser from './selectUser.vue'
import { queryCabinetNum } from '@/api/person/manage'
import { Modal } from 'ant-design-vue'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import {dbNumberToShowNumber} from '@utils/LockNumberTranfer.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'PersonForm',
  props: {
    statusOptions: {
      type: Array,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    AntModal,
    selectUser,
    Treeselect,
  },
  data() {
    return {
      loading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      factoryList: [],
      deptList: [],
      personTypeList: [],
      cabinetList: [],
      boxList: [],
      boxnumList: [],
      boxnumList1: [],
      boxnumList2: [],
      boxTypeList: [],
      masterList: [],
      regionList: [],
      boxindo: {},
      formTitle: '',
      boxId: undefined,
      cabId: undefined,
      boxNum: undefined,
      // 表单参数
      form: {
        id: undefined,
        perName: undefined,
        jobNum: undefined,
        departmentId: undefined,
        plantAreaId: undefined,
        cardId: undefined,
        personType: undefined,
        cabinetId: undefined,
        terminalId: undefined,
        keyCabinetNum: undefined,
      },
      ids: [],
      open: false,
      rules: {
        perName: [{ required: true, message: '人员姓名不能为空', trigger: 'blur' }],
        departmentId: [{ required: true, message: '部门不能为空', trigger: ['blur', 'change'] }],
        // plantAreaId: [{ required: true, message: '厂区不能为空', trigger: 'blur' }],
        cardId: [{ required: true, message: 'HID号不能为空', trigger: 'blur' }],
        personType: [{ required: true, message: '人员类型不能为空', trigger: 'blur' }],
        jobNum: [
          { required: true, message: '工号不能为空', trigger: 'blur' },
          // this.$validate.mobilePhone('请输入正确手机号')
          //  { validator: this.checkPhoneUnique }
        ],
      },
      typeStatus: undefined,
      modalWidth: '1520',
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {
    'form.terminalId'() {
      console.log('变动了')
      this.queryCabinetNum()
      // this.cabinetChange()
    },
  },
  methods: {
    normalizer(node) {
      //当子节点也就是children=[]时候去掉子节点
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    // 查询对应组柜剩余数量
    queryCabinetNum() {
      var params = {
        terminalId: this.form.terminalId,
      }
      queryCabinetNum(params).then((res) => {
        if (this.$refs.selectUser) {
          this.$refs.selectUser.maxCabinetNum = res.data - 0
        }
      })
    },
    /** 查询厂区列表 */
    getfactoryList() {
      checkBoxData().then((response) => {
        this.factoryList = response.data
        this.plantChange()
      })
    },
    // getboxList(){
    //   boxList().then(response => {
    //       this.boxList = response.rows
    //     }
    //   )
    // },
    /** 查询区域列表 */
    getregionList(data) {
      treeRegionList(data).then((response) => {
        this.regionList = response.data
        // this.form.parentId = this.regionList[0].id
        var params = {
          personId: this.form.id,
        }
        getSelectBoxRegionByPersonId(params).then(res => {
          var dataList = res.data
          if (this.regionList && this.regionList.length && dataList.length) {
            this.regionList.forEach((item) => {
              dataList.forEach((ele) => {
                if (item.id == ele.id) {
                  this.$nextTick(() => {
                    this.$set(item, 'isDisabled', true)
                  })
                } 
              })
            })
          }
        })
      })
    },
    getcabinetList(data) {
      getDataList(data).then((response) => {
        this.cabinetList = response.rows
        if (this.cabinetList.length > 0) {
          this.form.cabinetId = this.cabinetList[0].id
          this.cabChange()
        }
      })
    },
    /** 查询部门列表 */
    getdeptList() {
      treeselect().then((response) => {
        this.deptList = response.data
        // this.transformation(this.deptList)
        console.log(this.deptList)
      })
    },
    /* 树节点筛选 */
    filterTreeOption(input, treeNode) {
      var str = input.toLowerCase()
      var title = treeNode.data.props.title.toLowerCase()
      return title.includes(str)
    },
    searchFun(searchValue) {
      // treeselect({deptName:searchValue}).then((response) => {
      //   this.deptList = response.data
      // })
    },
    getcheckData(data) {
      terminalCondition(data).then((response) => {
        this.masterList = response.data
        if(response.data.length==0||response.data == []) {
          this.form.terminalId = ''
        }
      })
    },
    cabChange() {
      selectBoxByCabNum({ terminalId: this.form.terminalId }).then((response) => {
        if (response.data.length == 1) {
          if (response.data[0].data.length != 18) {
            response.data[0].data.splice(6, 0, { type: 1 })
            response.data[0].data.splice(7, 0, { type: 1 })
          }
          this.boxnumList = response.data[0].data
          console.log(this.boxnumList)
        } else if (response.data.length == 2) {
          if (response.data[0].data.length != 18) {
            response.data[0].data.splice(6, 0, { type: 1 })
            response.data[0].data.splice(7, 0, { type: 1 })
          }
          this.boxnumList = response.data[0].data
          this.boxnumList1 = response.data[1].data
          console.log(response.data)
        } else if (response.data.length == 3) {
          if (response.data[0].data.length != 18) {
            response.data[0].data.splice(6, 0, { type: 1 })
            response.data[0].data.splice(7, 0, { type: 1 })
          }
          if (this.form.plantAreaId == fcde8e7484734219be39c44ae6570f5a) {
            // 当选择的厂区是北京的时候
            // 此时ABC均有，所以把三个总数加一起得到箱子总数
            let countByCab = response.data[0].data.length + response.data[1].data.length +response.data[2].data.length
            if(countByCab ===44){
              response.data[0].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[1].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[2].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              this.boxnumList = response.data[0].data
              this.boxnumList1 = response.data[1].data
              this.boxnumList2 = response.data[2].data
              this.boxnumList = this.boxnumList1.concat(this.boxnumList, this.boxnumList2);
              this.boxnumList1 = []
              this.boxnumList2 = []
            }else if(countByCab ===60){
              response.data[0].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[1].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[2].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              this.boxnumList = response.data[0].data
              this.boxnumList1 = response.data[1].data
              this.boxnumList2 = response.data[2].data
              this.boxnumList = this.boxnumList1.concat(this.boxnumList, this.boxnumList2);
              this.boxnumList1 = []
              this.boxnumList2 = []
            }else{
              response.data[0].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[1].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              response.data[2].data.forEach(function(item, index) {
                item.changeShowNum = dbNumberToShowNumber(item.showNum,countByCab)
              });
              // dbNumberToShowNumber()
              this.boxnumList = response.data[0].data
              this.boxnumList1 = response.data[1].data
              this.boxnumList2 = response.data[2].data
            }
            
          }else{
            // A B C
            this.boxnumList = response.data[0].data
            this.boxnumList1 = response.data[1].data
            this.boxnumList2 = response.data[2].data
          }
      //       this.boxnumList = response.data[0].data
      //       this.boxnumList1 = response.data[1].data
      //       this.boxnumList2 = response.data[2].data
      //       let num=this.boxnumList.length+this.boxnumList1.length+this.boxnumList2.length;		  
		  // if(this.form.plantAreaId=='fcde8e7484734219be39c44ae6570f5a' && num==44 || num==60){
		  // 	let boxnumListlength=this.boxnumList1.length;
		  // 	let boxnumList2length=this.boxnumList.length+this.boxnumList1.length;
		  // 	this.boxnumList.forEach(function(item,index) { 
		  // 		item.showNumnews= 'A' +boxnumListlength+index+1;
		  // 	})
		  // 	this.boxnumList1.forEach(function(item,index) {
      //     if(index+1<10){
      //       item.showNumnews= 'A' + '0'+index+1;
      //     }else{
      //       item.showNumnews= 'A' +index+1;
      //     }
		  // 	})
		  // 	this.boxnumList2.forEach(function(item,index) {
		  // 		item.showNumnews= 'A' + boxnumList2length+index+1;
		  // 	})		  	
		  // }
        }
        // console.log(this.boxnumList)
      })
    },
    terminalChange() {
      if (this.form.terminalId) {
        // this.getcabinetList({terminalId:this.form.terminalId})
        this.cabChange()
      }
    },
    plantChange() {
      if (this.form.plantAreaId) {
        this.getregionList({ factoryId: this.form.plantAreaId })
      }
    },
    cabinetChange() {
      if (this.form.cabinetId) {
        statusBoxNum({ cabId: this.form.cabinetId }).then((response) => {
          console.log(response)
          this.boxindo = response.data
        })
      }
    },
    regionChange() {
      if (this.form.regionId) {
        this.getcheckData({ regionId: this.form.regionId })
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
      this.$emit('close')
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        perName: undefined,
        phoneNum: undefined,
        deptName: undefined,
        factoryName: undefined,
        cardId: undefined,
        personType: undefined,
        cabinetId: undefined,
        terminalId: undefined,
      }
    },
    // 表单重置
    reset1() {
      this.form = {
        id: undefined,
        perName: undefined,
        phoneNum: undefined,
        deptName: undefined,
        factoryName: undefined,
        cardId: undefined,
        personType: undefined,
        cabinetId: undefined,
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getfactoryList()
      this.getdeptList()
      this.getDicts('person_type').then((response) => {
        this.personTypeList = response.data
      })
      
      this.open = true
      this.formTitle = '添加人员'
    },
    distribution(row) {
      this.reset()
      this.open = true
      this.form = JSON.parse(JSON.stringify(row))
      this.form.terminalId = undefined
      // 每次打开前先清除区域和主控终端下拉框中的数据
      this.regionList = []
      this.masterList = []
      checkBoxData().then((response) => {
        var list = response.data
      console.log(this.form,list,'wwwwwwwwwwwwwwwwww')
        if(list && list.length) {
        var flag = false
          list.forEach(item => {
            if(item.id == this.form.plantAreaId) {
              flag = true
            }
          })
          if(!flag) {
            this.form.plantAreaId = undefined
          }
        }
      })
      this.boxnumList = []
      // this.getcabinetList()
      this.getfactoryList()
      // this.getcheckData()
      this.formTitle = '分配箱子'
      this.form.cabinetId = undefined
      var params = {
        personId: row.id,
      }
      getSelectBoxRegionByPersonId(params).then((res) => {
        var dataList = res.data
        if (this.form.plantAreaId) {
          var obj = {
            factoryId: this.form.plantAreaId,
          }
          treeRegionList(obj).then((response) => {
            this.regionList = response.data
            if (this.regionList && this.regionList.length && dataList.length) {
              this.form.terminalId = ''
              this.regionList.forEach((item) => {
                dataList.forEach((ele) => {
                  if (item.id == ele.id) {
                    this.$nextTick(() => {
                      this.$set(item, 'isDisabled', true)
                    })
                  } 
                })
              })
              console.log(this.regionList)
            }
            console.log(this.regionList)
            // this.form.parentId = this.regionList[0].id
          })
        }
      })
    },
    batchAllocation(type) {
      this.typeStatus = type
      if (type == 1) {
        this.modalWidth = '1520'
        this.formTitle = '批量分配'
      } else {
        this.modalWidth = '920'
        this.formTitle = '批量注销'
      }
      this.open = true
      // this.getcabinetList()
      // this.getcheckData()
      this.getfactoryList()
      // this.getDicts('cab_box_type').then(response => {
      //   this.boxTypeList = response.data
      // })
      // this.ids = ids;
      this.$nextTick(() => {
        if (type == 1) {
          this.$refs.selectUser.queryParam.binStatus = 0
        } else if (type == 2) {
          this.$refs.selectUser.queryParam.binStatus = 1
        }
      })
    },
    batch() {
      this.formTitle = '批量注销'
      this.open = true
      this.typeStatus = 2
      this.$nextTick(() => {
        this.$refs.selectUser.queryParam.binStatus = 1
      })
      this.getfactoryList()
    },
    /** 修改按钮操作 */
    handleUpdate(row, ids) {
      this.reset1()
      this.form = JSON.parse(JSON.stringify(row))
      this.getfactoryList()
      this.getdeptList()
      this.getDicts('person_type').then((response) => {
        this.personTypeList = response.data
      })
      this.formTitle = '编辑人员'
      this.open = true
    },
    checkPhoneNum() {},
    boxlistclick(item) {
      if (this.boxId) {
        if (item.id == this.boxId) {
          item.bindStatus = 0
          this.boxId = undefined
          this.cabId = undefined
          this.boxNum = undefined
        } else {
          if (item.bindStatus == 0) {
            this.boxnumList.forEach((item) => {
              if (item.id == this.boxId) {
                item.bindStatus = 0
              }
            })
            this.boxnumList1.forEach((item) => {
              if (item.id == this.boxId) {
                item.bindStatus = 0
              }
            })
            this.boxnumList2.forEach((item) => {
              if (item.id == this.boxId) {
                item.bindStatus = 0
              }
            })
            this.boxId = item.id
            this.cabId = item.cabId
            this.boxNum = item.num
          }
        }
      } else {
        if (item.bindStatus == 0) {
          item.bindStatus = 1
          this.boxId = item.id
          this.cabId = item.cabId
          this.boxNum = item.num
        }
      }
    },
    batchsubmitForm() {
      if (this.typeStatus == 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            var data = {
              terminalId: this.form.terminalId,
              selectQuantity: this.$refs.selectUser.userdata.length,
              // personList: this.ids,
              personList: this.$refs.selectUser.userdata,
              operType: 1,
            }
            batchAllotBox(data).then((response) => {
              this.$message.success('批量分配成功', 3)
              var that = this
              setTimeout(function () {
                that.open = false
                that.reset()
                that.$emit('ok')
                that.$refs.selectUser.userdata = []
                that.$refs.selectUser.selectedRowKeys = []
                that.$refs.selectUser.getList()
              }, 1000)
            })
          } else {
            return false
          }
        })
      } else {
        var that = this
        Modal.confirm({
          title: '是否确认批量注销？',
          content: '',
          onOk() {
            return new Promise((resolve, reject) => {
              var data = {
                personList: that.$refs.selectUser.userdata,
                operType: 2,
                // terminalId: that.$refs.selectUser.queryParam.terminalId
              }
              batchAllotBox(data).then((response) => {
                that.$message.success('批量注销成功', 3)
                that.open = false
                that.reset()
                that.$emit('ok')
                that.$refs.selectUser.selectedRowKeys = []
                that.$refs.selectUser.userdata = []
                setTimeout(function () {
                  that.$refs.selectUser.getList()
                }, 1000)
              })
              setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            }).catch(() => console.log('Oops errors!'))
          },
          onCancel() {},
        })
      }
    },
    distributionForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.boxId) {
            this.$message.error('请选择箱子', 3)
            return
          }
          var cabName = ''
          this.cabinetList.forEach((item) => {
            if (item.id == this.form.cabinetId) {
              cabName = item.name
            }
          })
          
          var params = {
            cabinetId: this.cabId,
            terminalId: this.form.terminalId,
            cabName: cabName,
            cardId: this.form.cardId,
            boxId: this.boxId,
            boxNum: this.boxNum,
            id: this.form.id,
            perName: this.form.perName,
            operType: 1,
          } 
          // var data ={
          //   cabinetId: this.form.cabinetId,
          //   terminalId: this.form.terminalId,
          //   cabName: cabName,
          //   cardId: this.form.cardId,
          //   boxId: this.boxId,
          //   boxNum: this.boxNum,
          //   id: this.form.id,
          //   perName: this.form.perName,
          //   operType: 1
          // }
          // this.form.cabName = cabName;
          // this.form.boxId = this.boxId;
          // this.form.boxNum = this.boxNum;
          // this.form.operType = 1
          allotBox(params).then((response) => {
            this.$message.success('分配成功', 3)
            this.boxId = undefined
            this.boxNum = undefined
            this.open = false
            this.$emit('ok')
          })
        } else {
          return false
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            editPerson(this.form).then((response) => {
              this.$message.success('修改成功', 3)
              this.open = false
              this.$emit('ok')
            })
          } else {
            savePerson(this.form).then((response) => {
              this.$message.success('新增成功', 3)
              this.open = false
              this.$emit('ok')
            })
          }
        } else {
          return false
        }
      })
    },
  },
}
