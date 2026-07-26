const Loader = ({ small = false }) => (
    <div className={`flex items-center justify-center ${small ? 'py-6' : 'py-20'}`}>
        <div
            className={`${small ? 'w-6 h-6 border-2' : 'w-10 h-10 border-4'} border-primary-500 border-t-transparent rounded-full animate-spin`}
        />
    </div>
);

export default Loader;