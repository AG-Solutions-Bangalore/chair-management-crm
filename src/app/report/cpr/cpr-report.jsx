import React from 'react'

const CprReport = () => {
  return (
    <div className="mx-10 text-sm max-w-[85rem] p-2 bg-white">
      <header className="text-center mb-2">
        <h1 className="text-center font-bold underline mb-[2px]">
          FRIENDS OF TRIBALS SOCIETY
        </h1>
        <h2 className="font-bold">
          CHAPTER PERFORMANCE REPORT
        </h2>
      </header>

      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <span className="font-bold">Name of the Chapter</span>
          <span className="ml-2">...........................</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">Report for the Month of</span>
          <span className="ml-2">......................</span>
        </div>
      </div>

    
      <div className="mb-2">
        <h3 className="font-bold mb-[2px] text-center">1- MEMBERSHIP INFORMATION</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className="border border-black p-2 text-sm font-bold text-center">
                  No. of Members as on March this year
                </th>
                <th rowSpan={2} className="border border-black p-2 text-sm font-bold text-center">
                  No. of members till last Month
                </th>
                <th rowSpan={2} className="border border-black p-2 text-sm font-bold text-center">
                  Total membership amount collected in this year
                </th>
                <th rowSpan={2} className="border border-black p-2 text-sm font-bold text-center">
                  Total Number of members as on date
                </th>
                <th className="border border-black p-2 text-sm font-bold text-left">
                  Men:
                </th>
              </tr>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-left">
                  Women:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-2 text-left">Rs.</td>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-2 text-left">Yuvs:</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

 
      <div className="mb-2">
        <h3 className="font-bold mb-[2px] text-center">2- EXECUTIVE COMMITTEE MEETING</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={5} className="border border-black p-2 text-sm font-bold text-center">
                  Total Number of Executive committee meetings held in this year
                </th>
                <th rowSpan={5} className="border border-black p-2 text-sm font-bold text-center">
                  Total No of Executive Committee Meetings held during the month
                </th>
                <th rowSpan={5} className="border border-black p-2 text-sm font-bold text-center">
                  Number of Executive Committee members
                </th>
                <th rowSpan={5} className="border border-black p-2 text-sm font-bold text-center">
                  Number of members invited
                </th>
                <th rowSpan={5} className="border border-black p-2 text-sm font-bold text-center">
                  Number of members attended
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Main points of Agenda
                </th>
              </tr>
              <tr><td className="border border-black p-2"></td></tr>
              <tr><td className="border border-black p-2"></td></tr>
              <tr><td className="border border-black p-2"></td></tr>
              <tr><td className="border border-black p-2"></td></tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="border border-black p-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

  
      <div className="mb-2">
        <h3 className="font-bold mb-[2px] text-center">3- OTS COLLECTION</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  PRP of this year
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Total Amount collected up to last month through Donor and CSR
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Amount collected in this month through donor contacts and OTS
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Amount Collected for OTS in this month by conducting any other events
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Total OTS collection and number of OTS up to the month
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-2 text-left">Donor:


                    <br/> CSR:
                </td>
                <td className="border border-black p-2 text-left">Donor:


                    <br/> CSR:
                </td>
                <td className="border border-black p-2 text-left">Nature of Event:
             


                    <br/>    Amount:
                </td>
                <td className="border border-black p-2 text-left">Amount:
             
                    <br/>    OTS:
                </td>
          
              
     
              </tr>
            </tbody>
          </table>
        </div>
      </div>

   
      <div className="mb-2">
        <h3 className="font-bold mb-[2px] text-center">4- VANYATRAS</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
              <col className="w-[16.66%]" />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={4} className="border border-black p-2 text-sm font-bold text-center">
                  Total Number of Vanyatras conducted in this year
                </th>
                <th rowSpan={4} className="border border-black p-2 text-sm font-bold text-center">
                  Number of Vanyatras conducted in this month
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Total Number of Yatris in this month
                </th>
                <th rowSpan={4} className="border border-black p-2 text-sm font-bold text-center">
                  Number of Ekal Vidyalayas visited in this month
                </th>
                <th className="border border-black p-2 text-sm font-bold text-center">
                  Names of Vidyalayas visited during the month
                </th>
                <th rowSpan={4} className="border border-black p-2 text-sm font-bold text-center">
                  Whether did Pravas during any Vanyatra in this month
                </th>
              </tr>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-left">Men:</th>
                <th className="border border-black p-2"></th>
              </tr>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-left">Women:</th>
                <th className="border border-black p-2"></th>
              </tr>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-left">Yuvs:</th>
                <th className="border border-black p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-2 text-left">New Members:</td>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-4 text-center"></td>
                <td className="border border-black p-4 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div className="mb-2">
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[50%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-left font-bold">
                  Observation /experience during Vanyatra, of specific relevance; attach separate sheet, if needed
                </td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    
      <div className="mb-2">
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[45%]" />
              <col className="w-[50%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">5</td>
                <td className="border border-black p-2 text-left">Please give details of programs / Activities during the month</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    
      <div className="mb-2">
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[45%]" />
              <col className="w-[50%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">6</td>
                <td className="border border-black p-2 text-left">Any specific points where you require attention of National Office including matters pending with them.</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

   
      <div className="mb-2">
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[45%]" />
              <col className="w-[50%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">7</td>
                <td className="border border-black p-2 text-left">Any Matter (s) pending with other Chapters</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    
      <div className="mb-2">
        <h3 className="font-bold mb-[2px] text-center">8 (a) - DISBURSEMENT TO ANCHALS</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[23.75%]" />
              <col className="w-[23.75%]" />
              <col className="w-[23.75%]" />
              <col className="w-[23.75%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-black p-2 text-sm font-bold text-center"></th>
                <th className="border border-black p-2 text-sm font-bold text-center">Names of Anchals</th>
                <th className="border border-black p-2 text-sm font-bold text-center">No of Acharyas given payment in the Anchal</th>
                <th className="border border-black p-2 text-sm font-bold text-center">Annual Target</th>
                <th className="border border-black p-2 text-sm font-bold text-center">Remittance till last Month</th>
                <th className="border border-black p-2 text-sm font-bold text-center">Remittance this Month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">1</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">2</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">3</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">4</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">5</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-center font-bold">6</td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-2">
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[45%]" />
              <col className="w-[50%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black p-2 text-center font-bold">8(b)</td>
                <td className="border border-black p-2 text-left">Reasons for withholding
                remittance to Anchals, if any</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-2">
        <h3 className="font-bold  border-t-2 border-l-2 border-r-2 border-black text-left">8 c : Running Schools Status</h3>
        <div className="overflow-auto print:overflow-visible">
          <table className="w-full border border-black table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
         
        
            </colgroup>
            <thead>
              <tr>
         
                <th className="border border-black p-2 text-sm font-bold text-center">Names of Anchals</th>
                <th className="border border-black p-2 text-sm font-bold text-center">No of schools in
                the Anchal</th>
                <th className="border border-black p-2 text-sm font-bold text-center">No of running
schools in the
Anchal</th>
                <th className="border border-black p-2 text-sm font-bold text-center">No of closed
Schools in the
Anchal</th>
                <th className="border border-black p-2 text-sm font-bold text-center">Reason for
                closure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
            
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CprReport