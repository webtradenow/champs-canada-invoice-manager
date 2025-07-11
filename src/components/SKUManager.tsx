import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Download,
  Link,
  AlertCircle
} from 'lucide-react';

const SKUManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRetailer, setFilterRetailer] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const skuMappings = [
    {
      id: '1',
      retailer_sku: 'BEN-LG-001',
      internal_sku: 'CH-LUGGAGE-001',
      retailer: 'Bentley\'s',
      product_name: 'Premium Travel Luggage Set',
      category: 'Luggage',
      price: 299.99,
      status: 'active'
    },
    {
      id: '2',
      retailer_sku: 'WMT-BP-002',
      internal_sku: 'CH-BACKPACK-002',
      retailer: 'Walmart',
      product_name: 'Business Backpack',
      category: 'Backpacks',
      price: 89.99,
      status: 'active'
    },
    {
      id: '3',
      retailer_sku: 'TGT-DL-003',
      internal_sku: 'CH-DUFFEL-003',
      retailer: 'Target',
      product_name: 'Sports Duffel Bag',
      category: 'Duffel Bags',
      price: 149.99,
      status: 'inactive'
    },
    {
      id: '4',
      retailer_sku: 'CCA-CB-004',
      internal_sku: 'CH-CARRYON-004',
      retailer: 'Champs Canada',
      product_name: 'Carry-On Spinner',
      category: 'Luggage',
      price: 199.99,
      status: 'active'
    },
    {
      id: '5',
      retailer_sku: 'BEN-TB-005',
      internal_sku: 'CH-TOTE-005',
      retailer: 'Bentley\'s',
      product_name: 'Leather Tote Bag',
      category: 'Tote Bags',
      price: 129.99,
      status: 'active'
    },
    {
      id: '6',
      retailer_sku: 'CIN-LG-011',
      internal_sku: 'CH-LUGGAGE-011',
      retailer: 'Champs International',
      product_name: 'Leather Tote Bag',
      category: 'Tote Bags',
      price: 129.99,
      status: 'active'
    },
  ];

  const retailers = ['Bentley\'s', 'Walmart', 'Target', 'Champs Canada', 'Champs International'];

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const filteredMappings = skuMappings.filter(mapping => {
    const matchesSearch = mapping.retailer_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mapping.internal_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mapping.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRetailer = filterRetailer === 'all' || mapping.retailer === filterRetailer;
    return matchesSearch && matchesRetailer;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SKU Manager</h1>
        <p className="text-gray-600">Manage product SKU mappings across all retailers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total SKUs</p>
              <p className="text-2xl font-bold text-gray-900">{skuMappings.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Mappings</p>
              <p className="text-2xl font-bold text-gray-900">{skuMappings.filter(s => s.status === 'active').length}</p>
            </div>
            <Link className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Retailers</p>
              <p className="text-2xl font-bold text-gray-900">{retailers.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(skuMappings.map(s => s.category)).size}</p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKUs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRetailer}
              onChange={(e) => setFilterRetailer(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Retailers</option>
              {retailers.map(retailer => (
                <option key={retailer} value={retailer}>{retailer}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Mapping
            </button>
          </div>
        </div>
      </div>

      {/* SKU Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{mapping.retailer_sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-blue-600">{mapping.internal_sku}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mapping.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mapping.retailer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mapping.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${mapping.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mapping.status)}`}>
                      {mapping.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add SKU Mapping</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retailer SKU
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WA-LG-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal SKU
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CH-LUGGAGE-001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Premium Travel Luggage Set"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retailer
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select Retailer</option>
                    {retailers.map(retailer => (
                      <option key={retailer} value={retailer}>{retailer}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select Category</option>
                    <option>Luggage</option>
                    <option>Backpacks</option>
                    <option>Duffel Bags</option>
                    <option>Tote Bags</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SKUManager;