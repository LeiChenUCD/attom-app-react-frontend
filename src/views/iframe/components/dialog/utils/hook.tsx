import dayjs from "dayjs";
import CommentForm from "../comment.vue";
import ViewDetail from "../details.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useStatusHooks } from "../hooks-status";
import { addDialog } from "@/components/ReDialog";
import type { CommentFormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { useRouter } from "vue-router";
import { insertNote, getNoteById } from "@/api/welcome";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";
import { ElLoading } from "element-plus";

export function useDialog() {
  const form = reactive({
    name: "",
    code: "",
    status: ""
  });
  const router = useRouter();
  const formRef = ref();
  const loading = ref(true);
  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  const currentComment = ref({});

  async function openViewDetailDialog(row?: CommentFormItemProps) {
    if (!row) {
      return;
    }
    addDialog({
      title: `View Detail`,
      props: {
        formInline: {
          detail: row
        }
      },
      width: "100%",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(ViewDetail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        done(); // 关闭弹框
      }
    });
  }

  async function openCommentDialog(row?: CommentFormItemProps) {
    if (!row) {
      return;
    }
    /*const param = {
      fid: row["fid"] ?? ""
    };
    const loadingData = ElLoading.service({
      lock: true,
      text: "Loading...",
      background: "rgba(0, 0, 0, 0.7)"
    });
    const { data } = await getNoteById(param);
    loadingData.close();
    if (data?.items?.length > 0) {
      currentComment.value = data?.items[0];
    } else {
      currentComment.value = {};
    }*/
    addDialog({
      title: `Add Comment`,
      props: {
        formInline: {
          detail: row,
          currentComment: currentComment
        }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(CommentForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as CommentFormItemProps;
        function chores() {
          message(`Add comment success`, {
            type: "success"
          });
          done(); // 关闭弹框
          //onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            onSaveData(curData.comment, row, chores);
          }
        });
      }
    });
  }

  async function onSaveData(comment, row, chores) {
    console.dir([comment, row, chores]);
    const fid = row["fid"] ? row["fid"].toString() : "";
    /*const note = row.note || '';
    let Notes = '';
    if (note) {
      Notes = `${note},`;
    }*/
    /*let overallNotes = "";
    if (currentComment.value?.fields) {
      for (let i = 0; i < currentComment.value.fields.Notes?.length; i++) {
        overallNotes += currentComment.value.fields.Notes[i].text;
      }
    }
    const ending =
      overallNotes?.length > 0 && overallNotes[overallNotes.length - 1] !== "\n"
        ? "\n"
        : "";

    const commentContent = `${overallNotes}${ending}[${dayjs(new Date().toISOString()).format("YYYY-MM-DD HH:mm")}] ${userInfo.username}: ${comment}`;
    const params = {
      id: currentComment.value?.record_id || "",
      censusTract: row.censustract,
      author: userInfo.username,
      fields: {
        fields: {
          Address: row.address,
          Notes: commentContent,
          ATTOMID: fid,
          "Census Tract": row.censustract
        }
      }
    };*/
    const comments = row?.comments || "";
    const commentParams = {
      user: userInfo.username,
      content: comment,
      fid: fid
    };
    const loadingData = ElLoading.service({
      lock: true,
      text: "Loading...",
      background: "rgba(0, 0, 0, 0.3)"
    });
    let res = await insertNote(commentParams);
    loadingData.close();
    if (res) {
      const newComment = `[${dayjs(res.timestamp).format("YYYY-MM-DD HH:mm")}] ${userInfo.username}: ${comment}`;
      let content = "";
      if (comments) {
        content = `${comments}\n${newComment}`;
      } else {
        content = `${newComment}`;
      }
      if (comments) {
        row.comments = `${content}`;
      } else {
        row.comments = content;
      }
      chores();
    }
  }

  onMounted(() => {});

  return {
    form,
    loading,
    openCommentDialog,
    openViewDetailDialog
  };
}
