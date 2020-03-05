import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  title_v?: string
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, onCancel, title_v } = props;

  return (
    <Modal
      destroyOnClose
      title={title_v || "新建规则"}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
