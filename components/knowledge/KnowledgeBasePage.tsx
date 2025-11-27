import React, { useState } from 'react';
import { FileText, Upload, Database, RefreshCw, Check, Trash2, Shield, Search, Globe, Type, Plus, X } from 'lucide-react';
import { KnowledgeSource } from '../../types';

const MOCK_SOURCES: KnowledgeSource[] = [
    { id: '1', type: 'document', name: 'Company Handbook.pdf', status: 'synced', size: '2.4 MB', updatedAt: '2024-03-15T10:00:00Z' },
    { id: '2', type: 'document', name: 'Pricing Guide 2024.pdf', status: 'synced', size: '1.1 MB', updatedAt: '2024-03-10T14:30:00Z' },
    { id: '3', type: 'integration', name: 'Salesforce Contacts', status: 'synced', details: 'Last sync: 2 mins ago', updatedAt: '2024-03-20T09:15:00Z' },
    { id: '4', type: 'url', name: 'Help Center (support.example.com)', status: 'syncing', details: 'https://support.example.com', updatedAt: '2024-03-20T09:20:00Z' },
];

const KnowledgeBasePage: React.FC = () => {
    const [sources, setSources] = useState<KnowledgeSource[]>(MOCK_SOURCES);
    const [isUploading, setIsUploading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addType, setAddType] = useState<'url' | 'text' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [inputName, setInputName] = useState('');

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            const newDoc: KnowledgeSource = {
                id: Math.random().toString(),
                type: 'document',
                name: 'New Uploaded Doc.pdf',
                status: 'synced',
                size: '0.5 MB',
                updatedAt: new Date().toISOString()
            };
            setSources([newDoc, ...sources]);
            setIsUploading(false);
        }, 1500);
    };

    const handleAddData = () => {
        if (!addType || !inputValue) return;

        const newSource: KnowledgeSource = {
            id: Math.random().toString(),
            type: addType,
            name: inputName || (addType === 'url' ? inputValue : 'New Text Note'),
            status: 'synced',
            details: addType === 'url' ? inputValue : `${inputValue.length} chars`,
            updatedAt: new Date().toISOString()
        };

        setSources([newSource, ...sources]);
        setShowAddModal(false);
        setAddType(null);
        setInputValue('');
        setInputName('');
    };

    const handleDelete = (id: string) => {
        setSources(sources.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Add Data Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {addType === 'url' ? 'Add Website URL' : 'Add Text Note'}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name / Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder={addType === 'url' ? "e.g., Company FAQ" : "e.g., Q4 Pricing Updates"}
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                />
                            </div>

                            {addType === 'url' ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="https://example.com/page"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                                        placeholder="Paste text content here..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddData}
                                    disabled={!inputValue}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Add Source
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-8 h-8 text-indigo-600" />
                        Knowledge Base (RAG)
                    </h2>
                    <p className="text-slate-500 mt-1">Manage the documents and data sources Korra uses to answer questions.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setAddType('url'); setShowAddModal(true); }}
                        className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Globe className="w-4 h-4 text-blue-500" />
                        Add URL
                    </button>
                    <button
                        onClick={() => { setAddType('text'); setShowAddModal(true); }}
                        className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Type className="w-4 h-4 text-amber-500" />
                        Paste Text
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">RAG Status</h3>
                        <span className="bg-green-400/20 text-green-100 px-2 py-1 rounded-full text-xs font-bold border border-green-400/30">
                            Active & Ready
                        </span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="text-indigo-100 text-sm mb-1">Total Documents</div>
                            <div className="text-3xl font-bold">{sources.filter(s => s.type === 'document').length}</div>
                        </div>
                        <div>
                            <div className="text-indigo-100 text-sm mb-1">Web & Text Sources</div>
                            <div className="text-3xl font-bold">{sources.filter(s => s.type === 'url' || s.type === 'text').length}</div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 text-xs text-indigo-100 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Data is isolated and encrypted.
                    </div>
                </div>

                {/* Sources List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900">Data Sources</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search sources..."
                                className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {sources.map(source => (
                            <div key={source.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${source.type === 'document' ? 'bg-red-50 text-red-600' :
                                            source.type === 'integration' ? 'bg-blue-50 text-blue-600' :
                                                source.type === 'url' ? 'bg-sky-50 text-sky-600' :
                                                    'bg-amber-50 text-amber-600'
                                        }`}>
                                        {source.type === 'document' && <FileText className="w-5 h-5" />}
                                        {source.type === 'integration' && <RefreshCw className="w-5 h-5" />}
                                        {source.type === 'url' && <Globe className="w-5 h-5" />}
                                        {source.type === 'text' && <Type className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">{source.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                            <span className="capitalize">{source.type}</span>
                                            <span>•</span>
                                            <span>{source.size || source.details}</span>
                                            <span>•</span>
                                            <span>{new Date(source.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {source.status === 'syncing' ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                            Syncing
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            <Check className="w-3 h-3" />
                                            Synced
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleDelete(source.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Remove Source"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBasePage;
