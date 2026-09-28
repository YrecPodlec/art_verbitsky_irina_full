import styles from './interior-home.module.scss';

type Props = {title: string; number: string};

// Общая верхняя строка задаёт одинаковый ритм всем секциям страницы.
export function SectionLabel({title, number}: Props) {
  return (
    <div className={styles.sectionLabel}>
      <span>✦ {title}</span>
      <span>{number}</span>
    </div>
  );
}
