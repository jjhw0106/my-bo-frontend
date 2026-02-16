import * as XLSX from 'xlsx';

export const useExcel = () => {

    const downloadAsExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
        // 데이터 없을 때 실행 안되게 하려면 구현하기
        // if (!data || data.length == 0) {
        //     alert("다운로드 할 데이터가 없습니다.")
        //     return;
        // }
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        if (import.meta.client) {
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        }
    }

    return { downloadAsExcel }
}