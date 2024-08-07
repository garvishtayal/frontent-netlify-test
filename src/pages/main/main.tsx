import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Popup from './popup/popup';
import './main.css';
import axios from 'axios';

const itemsPerPage = 5;

type Lead = {
  _id: string,
  name: string;
  email: string;
  number: string;
  product: string;
};

function Main() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupState, setPopupState] = useState<'create' | 'edit'>('create');
  const [editData, setEditData] = useState<{ _id:string; name: string; email: string; number: string; product: string } | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://128.199.147.135:3002//get-leads', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchLeads();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (data: { _id:string; name: string; email: string; number: string; product: string }) => {
    console.log(data._id);
    setPopupState('edit');
    setEditData(data);
    setIsPopupOpen(true);
  };

  const handleCreate = () => {
    setPopupState('create');
    setEditData(null);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://128.199.147.135:3002//delete-lead/${id}`);
    console.log('Lead deleted successfully');
    fetchLeads();
  }

  const closePopup = () => {
    setIsPopupOpen(false);
    fetchLeads();
  }

  if (loading) {
    return <div>Loading...</div>;
  }




  return (
    <>
      <div className='create-btn-container'>
        <button className='create-button' onClick={handleCreate}>Create</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Product</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((item, index) => (
                <tr key={index} className="table-row">
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.number}</td>
                  <td>{item.product}</td>
                  <td className="actions">
                    <button className="action-button edit" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="action-button delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No leads available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Render Popup Component */}
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        state={popupState}
        data={editData ?? undefined} // Pass editData only if it's not null
      />
    </>
  );
};

export default Main;
