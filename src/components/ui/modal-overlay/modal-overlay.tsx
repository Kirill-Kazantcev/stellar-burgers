import { FC, memo } from 'react';
import styles from './modal-overlay.module.css';
import { TModalOverlayUIProps } from './type';

export const ModalOverlayUI: FC<TModalOverlayUIProps> = memo(
  ({ onClick, dataCy }) => (
    <div
      className={styles.overlay}
      onClick={onClick}
      data-cy={dataCy || 'modal-overlay'}
    />
  )
);
