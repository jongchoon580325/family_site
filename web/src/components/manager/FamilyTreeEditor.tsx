'use client';

import { useState, useMemo } from 'react';
import { useFamilyTreeStore } from '@/store/family-tree-store';
import { FamilyMember, LocalizedString, Language } from '@/types/family-tree';
import { FamilyTree } from '@/components/family-tree/FamilyTree';
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    ChevronRight,
    ChevronDown,
    User,
    Users,
    Globe
} from 'lucide-react';

interface FamilyMemberFormData {
    nameKo: string;
    nameEn: string;
    spouseKo: string;
    spouseEn: string;
    parentId: string;
}

const initialFormData: FamilyMemberFormData = {
    nameKo: '',
    nameEn: '',
    spouseKo: '',
    spouseEn: '',
    parentId: '',
};

export function FamilyTreeEditor() {
    const { data, language, setLanguage, addMember, updateMember, removeMember, getAllMembers } = useFamilyTreeStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FamilyMemberFormData>(initialFormData);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['god-father']));
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const allMembers = useMemo(() => getAllMembers(), [getAllMembers, data]);

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleStartAdd = (parentId: string) => {
        setFormData({ ...initialFormData, parentId });
        setIsAdding(true);
        setEditingId(null);
    };

    const handleStartEdit = (member: FamilyMember) => {
        setFormData({
            nameKo: member.name.ko,
            nameEn: member.name.en,
            spouseKo: member.spouse?.ko || '',
            spouseEn: member.spouse?.en || '',
            parentId: '',
        });
        setEditingId(member.id);
        setIsAdding(false);
    };

    const handleSaveNew = () => {
        if (!formData.nameKo.trim() || !formData.nameEn.trim()) return;

        const newMember: FamilyMember = {
            id: `member-${Date.now()}`,
            name: { ko: formData.nameKo, en: formData.nameEn },
            spouse: formData.spouseKo.trim()
                ? { ko: formData.spouseKo, en: formData.spouseEn }
                : null,
            children: [],
        };

        addMember(formData.parentId, newMember);
        setFormData(initialFormData);
        setIsAdding(false);

        // Auto-expand parent node
        setExpandedNodes(prev => new Set([...prev, formData.parentId]));
    };

    const handleSaveEdit = () => {
        if (!editingId || !formData.nameKo.trim() || !formData.nameEn.trim()) return;

        updateMember(editingId, {
            name: { ko: formData.nameKo, en: formData.nameEn },
            spouse: formData.spouseKo.trim()
                ? { ko: formData.spouseKo, en: formData.spouseEn }
                : null,
        });

        setEditingId(null);
        setFormData(initialFormData);
    };

    const handleDelete = (id: string) => {
        removeMember(id);
        setShowDeleteConfirm(null);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData(initialFormData);
    };

    // Recursive tree node renderer
    const renderTreeNode = (member: FamilyMember, depth: number = 0) => {
        const isExpanded = expandedNodes.has(member.id);
        const hasChildren = member.children.length > 0;
        const isEditing = editingId === member.id;
        const displayName = member.name[language];
        const spouseName = member.spouse?.[language];

        return (
            <div key={member.id} className="select-none">
                <div
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isEditing ? 'bg-amber-100' : 'hover:bg-stone-50'
                        }`}
                    style={{ paddingLeft: `${depth * 20 + 12}px` }}
                >
                    {/* Expand/Collapse Toggle */}
                    <button
                        onClick={() => toggleExpand(member.id)}
                        className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-600"
                        disabled={!hasChildren}
                    >
                        {hasChildren ? (
                            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                        ) : (
                            <div className="w-4 h-4" />
                        )}
                    </button>

                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                        {spouseName ? <Users className="w-4 h-4 text-pink-500" /> : <User className="w-4 h-4 text-pink-500" />}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                        <span className="font-medium text-stone-700 truncate block">
                            {displayName}
                            {spouseName && <span className="text-stone-500"> · {spouseName}</span>}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleStartAdd(member.id)}
                            className="p-1.5 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="자녀 추가"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleStartEdit(member)}
                            className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="수정"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        {member.id !== 'god-father' && (
                            <button
                                onClick={() => setShowDeleteConfirm(member.id)}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="삭제"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="border-l-2 border-stone-200 ml-6">
                        {member.children.map(child => renderTreeNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Family Tree Editor</h2>
                    <p className="text-sm text-stone-500 mt-1">가족 구성원을 추가, 수정, 삭제할 수 있습니다.</p>
                </div>

                {/* Language Toggle */}
                <div className="flex items-center gap-2 bg-stone-100 rounded-full p-1">
                    <button
                        onClick={() => setLanguage('ko')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'ko'
                                ? 'bg-white text-stone-800 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        한국어
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'en'
                                ? 'bg-white text-stone-800 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        EN
                    </button>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Tree List */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <h3 className="font-semibold text-stone-700 mb-3 px-2">가족 구성원 목록</h3>
                    <div className="max-h-[500px] overflow-y-auto">
                        {renderTreeNode(data.root)}
                    </div>
                </div>

                {/* Right: Preview + Form */}
                <div className="space-y-4">
                    {/* Mini Preview */}
                    <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto">
                        <h3 className="text-xs text-stone-400 uppercase tracking-wider mb-3">실시간 미리보기</h3>
                        <div className="scale-75 origin-top-left">
                            <FamilyTree root={data.root} language={language} />
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    {(isAdding || editingId) && (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                                {isAdding ? <Plus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                {isAdding ? '새 가족 구성원 추가' : '가족 구성원 수정'}
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1">이름 (한국어)</label>
                                    <input
                                        type="text"
                                        value={formData.nameKo}
                                        onChange={(e) => setFormData({ ...formData, nameKo: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="홍길동"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1">Name (English)</label>
                                    <input
                                        type="text"
                                        value={formData.nameEn}
                                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Hong Gil-dong"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1">배우자 (한국어)</label>
                                    <input
                                        type="text"
                                        value={formData.spouseKo}
                                        onChange={(e) => setFormData({ ...formData, spouseKo: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="(선택)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-600 mb-1">Spouse (English)</label>
                                    <input
                                        type="text"
                                        value={formData.spouseEn}
                                        onChange={(e) => setFormData({ ...formData, spouseEn: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="(Optional)"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={isAdding ? handleSaveNew : handleSaveEdit}
                                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    저장
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    {!isAdding && !editingId && (
                        <div className="bg-stone-100 rounded-xl p-4 text-center text-stone-500 text-sm">
                            <p>왼쪽 목록에서 구성원을 선택하여 수정하거나,</p>
                            <p className="mt-1">+ 버튼을 클릭하여 자녀를 추가하세요.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-stone-800 mb-2">삭제 확인</h3>
                        <p className="text-sm text-stone-600 mb-4">
                            이 구성원과 모든 하위 자녀들이 함께 삭제됩니다. 계속하시겠습니까?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FamilyTreeEditor;
