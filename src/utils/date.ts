import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export function formatDate(
  date: Date | string,
  expectedFormat = 'dd MMM yyyy'
): string {
  return format(new Date(date), expectedFormat, { locale: ptBr });
}
