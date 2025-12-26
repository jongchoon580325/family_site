"use client";

import { useState } from "react";
import { Download, Upload, Database, AlertTriangle, CheckCircle, Loader2, FileJson } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

export function DataBackupSection() {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

    // Export Data (JSON Download)
    const handleExport = async () => {
        setIsExporting(true);
        setMessage({ text: "데이터를 수집 중입니다...", type: "info" });

        try {
            const collectionsToExport = ['stories', 'family-trees', 'gallery'];
            const data: Record<string, any> = {
                metadata: {
                    exportedAt: new Date().toISOString(),
                    version: "1.0"
                }
            };

            for (const colName of collectionsToExport) {
                const querySnapshot = await getDocs(collection(db, colName));
                data[colName] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }

            // Create JSON File
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `nafmaily_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setMessage({ text: "백업 파일 다운로드가 완료되었습니다.", type: "success" });
        } catch (error) {
            console.error(error);
            setMessage({ text: "백업 중 오류가 발생했습니다.", type: "error" });
        } finally {
            setIsExporting(false);
        }
    };

    // Import Data (Restore)
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("주의: 데이터를 복구하면 기존 데이터에 덮어쓰거나 추가됩니다. 계속하시겠습니까?")) {
            e.target.value = ''; // Reset input
            return;
        }

        setIsImporting(true);
        setMessage({ text: "데이터 복구 중...", type: "info" });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonContent = event.target?.result as string;
                const data = JSON.parse(jsonContent);

                if (!data.metadata || !data.stories) {
                    throw new Error("유효하지 않은 백업 파일 형식입니다.");
                }

                const batch = writeBatch(db);
                let operationCount = 0;

                // Process Collections
                const collectionsToImport = ['stories', 'family-trees', 'gallery'];

                for (const colName of collectionsToImport) {
                    if (data[colName] && Array.isArray(data[colName])) {
                        for (const item of data[colName]) {
                            const { id, ...docData } = item;
                            const docRef = doc(db, colName, id); // Use original ID
                            batch.set(docRef, docData, { merge: true });
                            operationCount++;
                        }
                    }
                }

                // Commit Batch (Limit 500 operations - naive implementation, assumes < 500 for now)
                // TODO: Implement chunking if data grows large
                if (operationCount > 490) {
                    setMessage({ text: "데이터가 너무 많아(500개 이상) 일부만 처리될 수 있습니다. 개발자에게 문의하세요.", type: "error" });
                    // Proceed anyway for now or implement chunking
                    await batch.commit();
                } else if (operationCount > 0) {
                    await batch.commit();
                    setMessage({ text: `성공적! ${operationCount}개의 데이터가 복구되었습니다.`, type: "success" });
                } else {
                    setMessage({ text: "복구할 데이터가 없습니다.", type: "info" });
                }

            } catch (error) {
                console.error(error);
                setMessage({ text: "복구 실패: 파일 형식이 올바르지 않거나 오류가 발생했습니다.", type: "error" });
            } finally {
                setIsImporting(false);
                if (e.target) e.target.value = ''; // Reset input
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 mt-6">
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                Data Management
            </h3>

            <div className="space-y-6">
                {/* Export Section */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h4 className="font-medium text-stone-700 mb-2">Data Backup</h4>
                    <p className="text-sm text-stone-500 mb-4">
                        모든 데이터(Story, Tree, Gallery)를 JSON 파일로 다운로드합니다. 이미지 파일은 포함되지 않습니다(텍스트 및 링크만 백업).
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors shadow-sm"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download Backup (JSON)
                    </button>
                </div>

                {/* Import Section */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="font-medium text-amber-900 mb-2">Data Restore</h4>
                    <p className="text-sm text-amber-700 mb-4">
                        백업된 JSON 파일을 업로드하여 데이터를 복구합니다. <br />
                        <span className="font-bold">주의:</span> 동일한 ID의 데이터는 덮어씌워집니다.
                    </p>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors shadow-sm cursor-pointer">
                            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Restore from JSON
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                disabled={isImporting}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' :
                        message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                            message.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                                <FileJson className="w-5 h-5" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
