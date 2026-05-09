import { useParams, useNavigate } from 'react-router-dom';

function GatoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>Voltar</button>
      <p>Detalhe do gato {id}</p>
    </div>
  );
}

export default GatoDetalhe;