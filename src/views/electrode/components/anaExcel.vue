<template>
    <span>
        <input class="input-file" type="file" @change="exportData"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        <el-button type="primary" @click="btnClick">导入EXCEL</el-button>
    </span>
</template>

<script>
    import * as XLSX from  'xlsx'

    export default {
        name: 'importFile',
        data() {
            return {
                outdata: null,
                isVisibleSuccess: false,
                index: 1, //上传顺序
            }
        },
        methods: {
            btnClick() {
                this.isVisibleSuccess = false
                document.querySelector('.input-file').value = ''
                document.querySelector('.input-file').click()
            },
            exportData(event) {
                // console.log(document.querySelector('.input-file'));
                if (!event.currentTarget.files.length) {
                    return
                }
                let _this = this
                    // 拿取文件对象
                var f = event.currentTarget.files[0]
                    // 用FileReader来读取
                var reader = new FileReader()
                    // 重写FileReader上的readAsBinaryString方法
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = ''
                    var wb // 读取完成的数据
                    var outdata // 你需要的数据
                    var reader = new FileReader()
                    reader.onload = function(e) {
                        // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
                        var bytes = new Uint8Array(reader.result)
                        var length = bytes.byteLength
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i])
                        }

                        // 接下来就是xlsx了，具体可看api
                        wb = XLSX.read(binary, {
                                type: 'binary'
                            })


                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                        _this.isVisibleSuccess = true //显示成功
                        _this.outdata = outdata //获取数据
                        let newList= outdata.map((item,index) =>{
                            return Object.assign({},{
                                'name':item['库位']
                            })
                        })
                        _this.$emit("doAna",newList)

                    }

                    reader.readAsArrayBuffer(f)
                }
                reader.readAsBinaryString(f)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .input-file {
        display: none;
    }
    
    .top {
        margin-bottom: 15px;
    }
    
    .footer {
        text-align: right;
        margin-top: 15px;
    }
    
    .import-success {
        margin-top: 10px;
        color: rgba(10, 180, 105, 1);
    }
</style>
