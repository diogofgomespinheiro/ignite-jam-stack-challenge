import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: ptBr });
}