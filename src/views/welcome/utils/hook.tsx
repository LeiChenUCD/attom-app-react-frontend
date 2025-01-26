import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useStatusHooks } from "../hooks-status";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { useRouter } from "vue-router";
import { getCensusListApi, getCensusTractInfoListApi, createAllianceApi, updateAllianceApi, deleteAllianceApi } from "@/api/welcome";

export function useRole() {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const router = useRouter();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = useStatusHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "Census Tract",
      prop: "censustract",
      minWidth: 120
    },
    {
      label: "Home Count",
      prop: "count",
      minWidth: 100
    },
    {
      label: "Commented House Count",
      prop: "commentedHouseCount",
      minWidth: 120
    },
    {
      label: "Comment %",
      prop: "comment",
      minWidth: 100,
      formatter: ({ comment }) =>
        comment + '%'
    },
    {
      label: "Median Lot Area sf",
      prop: "median_arealotsf",
      minWidth: 100
    },
    {
      label: "Last Comment Time",
      minWidth: 180,
      prop: "date",
      formatter: ({ date }) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : ''
    },
    {
      label: "Last Commented By",
      prop: "lastCommentedBy",
      minWidth: 100
    },


    // {
    //   label: "备注",
    //   prop: "remark",
    //   minWidth: 150
    // },
    /*
    {
      label: "更新时间",
      minWidth: 180,
      prop: "updatedAt",
      formatter: ({ updatedAt }) =>
        dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")
    },*/
    {
      label: "Operation",
      fixed: "right",
      width: 100,
      slot: "operation"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        updateStatus(index, row);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  async function updateStatus(index, row) {
    const res = await updateAllianceApi(row._id, row);
    if (res.errno === 0) {
      message(`已${row.status === 0 ? "停用" : "启用"}${row.name}`, {
        type: "success"
      });
      switchLoadMap.value[index] = Object.assign(
        {},
        switchLoadMap.value[index],
        {
          loading: false
        }
      );
    } else {
      message(res.message, { type: "error" });
    }
  }

  async function handleDelete(row) {
    const res = await deleteAllianceApi(row?._id);
    if (res.errno === 0) {
      message(`删除成功`, { type: "success" });
      onSearch();
    } else {
      message(`删除失败`, { type: "error" });
    }
  }

  function handleSizeChange(val: number) {
    pagination.currentPage = 1;
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...toRaw(form)
    }
    const obj = {
      query: "\
        SELECT \
            CensusTract, \
            count(1), \
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY AreaLotSF) AS median_AreaLotSF \
        FROM \
            taxassessor \
        where \
            (PropertyAddressCity = 'CAMPBELL' OR PropertyAddressCity = 'LOS ALTOS') \
            AND PropertyAddressFull IS NOT NULL \
            AND AreaLotSF IS NOT NULL \
            AND PropertyLatitude IS NOT NULL \
            AND PropertyLongitude IS NOT NULL \
        group by \
            CensusTract \
        order by \
            count desc \
     "
    }

    const param = JSON.stringify(obj);
    const censusTractRes = await getCensusListApi(param);
    const censusTractInfoRes = await getCensusTractInfoListApi({});
    const censusTractInfoList = censusTractInfoRes?.data?.items || [];
    const list = buildResultList(censusTractRes, censusTractInfoList);
    dataList.value = list;
    pagination.total = list?.length || 0;
    loading.value = false;
  }

  function getCensusTractInfoByCensustract(censustract: any, list: any) {
    let res
    if (censustract && list?.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        const fields = row?.fields || {};
        if (censustract === fields['Census Tract']) {
          res = {
            commentedHouseCount: fields['Count'] || 0,
            date: fields['Date'],
            lastCommentedBy: fields['Last Commented By'].length > 0 ? fields['Last Commented By'][0].text : ''
          }
          break;
        }
      }
    }
    return res;
  }

  function buildResultList(list: any, censusTractInfoList: any) {
    const res = [];
    if (list?.length > 0) {
      const totalRow = {
        censustractId: 0,
        censustract: 'All',
        count: 0,
        commentedHouseCount: 0,
        comment: '',
      };
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        row.censustractId = row.censustract;
        row.commentedHouseCount = 0;
        const count = row.count;
        const censusTractInfo = getCensusTractInfoByCensustract(row.censustract, censusTractInfoList);
        if (censusTractInfo) {
          totalRow.commentedHouseCount += censusTractInfo.commentedHouseCount;
          row.comment = (censusTractInfo.commentedHouseCount / row.count * 100).toFixed(2);
          res.push({ ...row, ...censusTractInfo });
        } else {
          row.comment = '0';
          res.push(row);
        }
        if (count) {
          totalRow.count += Number(count);
        }
        totalRow.comment = (totalRow.commentedHouseCount / totalRow.count * 100).toFixed(2);
      }
      res.unshift(totalRow);
    }
    return res;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}会议`,
      props: {
        formInline: {
          _id: row?._id ?? "",
          name: row?.name ?? "",
          code: row?.code ?? "",
          remark: row?.remark ?? "",
          imageUrl: row?.imageUrl ?? "",
        }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`${title}成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            onSaveData(curData, chores);
          }
        });
      }
    });
  }

  async function onSaveData(curData, chores) {
    let res
    if (curData._id) {
      res = await updateAllianceApi(curData._id, curData);
    } else {
      res = await createAllianceApi(curData);
    }
    if (res?.errno === 0) {
      chores();
    }
  }

  /** 菜单权限 */
  function handleMenu() {
    message("等菜单管理页面开发后完善");
  }

  function onGoTopPage(row: any) {
    router.push(`/main-view/index/${row.censustractId}`)
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    onGoTopPage
  };
}
