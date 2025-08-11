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
      fullscreen: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      showClose: false,
      headerRenderer: ({ close, titleId, titleClass }) => (
        // jsx 语法
        <div class="flex flex-row justify-between">
          <h4 style="display:flex;align-items: center;" id={titleId} class={titleClass} onClick={close}>
            <svg t="1754880692419" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1543" width="20" height="20"><path d="M395.21518 513.604544l323.135538-312.373427c19.052938-18.416442 19.052938-48.273447 0-66.660212-19.053961-18.416442-49.910737-18.416442-68.964698 0L291.75176 480.290811c-19.052938 18.416442-19.052938 48.273447 0 66.660212l357.633237 345.688183c9.525957 9.207709 22.01234 13.796214 34.497699 13.796214 12.485359 0 24.971741-4.588505 34.466999-13.82896 19.052938-18.416442 19.052938-48.242747 0-66.660212L395.21518 513.604544z" fill="#272636" p-id="1544"></path></svg>
            Back To Search
          </h4>
        </div>
      ),
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

  onMounted(() => { });

  return {
    form,
    loading,
    openCommentDialog,
    openViewDetailDialog
  };
}
