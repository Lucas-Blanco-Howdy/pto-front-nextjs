import SalesforceForm from '@/components/SalesforceForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            BEST PTO FORM THAT YOU&apos;VE EVER SEEN IN YOUR ENTIRE LIFE
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lets take some rest, after all... You deserve it :).
          </p>
        </div>
        
        <SalesforceForm />
        
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
            </h3>
            
            <div className="mt-4 text-xs text-blue-600">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
