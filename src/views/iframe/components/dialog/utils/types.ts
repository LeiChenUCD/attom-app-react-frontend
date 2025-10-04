// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface CommentFormItemProps {
  currentComment: any;
  comment: string;
  detail: object;
}
interface CommentFormProps {
  formInline: CommentFormItemProps;
}

export type { CommentFormItemProps, CommentFormProps };
