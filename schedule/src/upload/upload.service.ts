import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { VALID_SURNAMES } from './dto';

@Injectable()
export class UploadService {
  async processExcelFile(surname: string, filePath: string) {
    if (!VALID_SURNAMES.includes(surname)) {
      throw new BadRequestException(
        'Преподавателя с такой фамилией не существует или не написаны иницыалы',
      );
    }

    const file = fs.readFileSync(filePath);
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Проверка первой ячейки
    const firstCellAddress = 'A1';
    const firstCell = worksheet[firstCellAddress];
    if (
      !firstCell ||
      typeof firstCell.v !== 'string' ||
      firstCell.v.trim() !== 'День недели'
    ) {
      throw new BadRequestException('Неправильное содержание файла');
    }

    const filteredCells = [];
    const daysOfWeek = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ];
    let currentDayOfWeek = '';

    // Перебор всех ячеек и фильтрация по наличию фамилии
    for (const cellAddress in worksheet) {
      if (cellAddress[0] === '!') continue;

      const cell = worksheet[cellAddress];

      const column = cellAddress.match(/[A-Z]+/)[0];
      if (
        column === 'A' &&
        typeof cell.v === 'string' &&
        daysOfWeek.includes(cell.v.trim())
      ) {
        currentDayOfWeek = cell.v.trim();
      }

      if (typeof cell.v === 'string' && cell.v.includes(surname)) {
        const groupName = this.findGroupNameAbove(cellAddress, worksheet);
        const pairNumber = this.findPairNumber(cellAddress, worksheet);

        const { subject, teacher, auditorium } = this.splitValueBySurname(
          cell.v,
          surname,
        );

        filteredCells.push({
          group: groupName,
          day_of_week: currentDayOfWeek,
          pair_number: pairNumber,
          subject,
          teacher,
          auditorium,
        });
      }
    }

    fs.unlinkSync(filePath);

    return {
      message: `Ячейки, содержащие фамилию ${surname}`,
      cells: filteredCells,
    };
  }

  private findGroupNameAbove(
    cellAddress: string,
    worksheet: XLSX.WorkSheet,
  ): string {
    const column = cellAddress.match(/[A-Z]+/)[0];
    const aboveRow = 1;

    const addressAbove = `${column}${aboveRow}`;
    const cellAbove = worksheet[addressAbove];

    if (
      cellAbove &&
      typeof cellAbove.v === 'string' &&
      cellAbove.v.trim() !== ''
    ) {
      return cellAbove.v.trim();
    }
    return '';
  }

  private splitValueBySurname(
    value: string,
    surname: string,
  ): { subject: string; teacher: string; auditorium: string } {
    const [beforeSurname, afterSurname] = value.split(surname);
    const subject = beforeSurname.trim();
    const teacher = surname;
    const auditorium = afterSurname.trim();

    return { subject, teacher, auditorium };
  }

  private findPairNumber(
    cellAddress: string,
    worksheet: XLSX.WorkSheet,
  ): string {
    const row = cellAddress.match(/\d+/)[0];
    const address = `B${row}`;
    const cell = worksheet[address];

    if (cell && typeof cell.v === 'string') {
      return cell.v.trim();
    }

    return '';
  }
}
