
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement  } from 'chart.js';


const Analytics = () => {
  
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedModeOfPayment, setSelectedModeOfPayment] = useState(null);
    const [receipts, setReceipts] = useState([]); 
    const [analyticsReceipts, setAnalyticsReceipts] = useState([]); 
    const [highestFeeMonth, setHighestFeeMonth] = useState('');
    const [leastFeeMonth, setLeastFeeMonth] = useState('');
    const [averageFeePaid, setAverageFeePaid] = useState('');
    const [mostFeePaidDate, setMostFeePaidDate] = useState('');
    const [averageDailyFee, setAverageDailyFee] = useState('');
    const [totalFeeInRange, setTotalFeeInRange] = useState('');

    const currentDate = new Date().toISOString().split('T')[0];

    const [startDate, setStartDate] = useState('2023-01-01'); // Default start date
    const [endDate, setEndDate] = useState(currentDate);
    console.log(currentDate)

    
    const isoFormattedStartDate = `${startDate}T00:00:00.000Z`;
    const isoFormattedEndDate = `${endDate}T00:00:00.000Z`;

     
  

      const handleBranchChange = (event) => {
      setSelectedBranch(event.target.value);
      
      };


      const fetchBranches = async () => {
          try {
            var SchoolManagementSystemApi = require('school_management_system_api');
            var api = new SchoolManagementSystemApi.DbApi();
            const opts = {
              body: {
                collectionName: 'branches',
                query: {},
                type: 'findMany',
              },
            };
      
            console.log(opts.body);
      
            api.dbGet(opts, function (error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  setBranches(responseBody); // Assuming the actual data is in responseBody.data 
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });
          } catch (error) {
            console.error('Error:', error);
          }
        };
      
        useEffect(() => {
          fetchBranches();
        }, []);
       

        const generateBatches = () => {
          const startYear = 2022;
          const endYear = 2098;
          const batches = [];
          
          for (let year = startYear; year <= endYear; year += 1) {
            batches.push(`${year}-${year + 2}`);
          }
          
          return batches;
        };
        
        const batchOptions = generateBatches();

        const handleFetchClick = () => {
          if(!selectedBranch || (selectedBranch ==='ANY') )
          {
            setSelectedBranch(null);
          }
          else if(!selectedBatch || (selectedBatch ==='ANY') )
          {
            setSelectedBatch(null);
          }
          else if(!selectedModeOfPayment || (selectedModeOfPayment ==='ANY') )
          {
            setSelectedModeOfPayment(null);
          }
          else {
            fetchReportReceipts();
          }
          fetchReportReceipts();
        };


        const fetchReportReceipts = async () => {
          try {
            const SchoolManagementSystemApi = require('school_management_system_api');
            const api = new SchoolManagementSystemApi.DbApi();
            
            let query = {};

            if (selectedBranch !== null) {
              query.branch = selectedBranch;
            }

            if (selectedBatch !== null) {
              query.batch = selectedBatch;
            }

            if (selectedModeOfPayment !== null) {
              query.modeOfPayment = selectedModeOfPayment;
            }

            console.log(query);
            const opts = {
              body: {
                collectionName: 'receipts',
                query: query,
                type: 'findMany',
              },
            };
        
            console.log(opts.body);
        
            api.dbGet(opts, function(error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  setReceipts  (responseBody); // Assuming the actual data is in responseBody.data
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });
            
            
            
            
          } catch (error) {
            console.error('Error during fetch:', error);
          }
        };
        
        // Make sure to call fetchReportReceipts appropriately, for example, in an useEffect hook
        useEffect(() => {
          // Ensure all selections are made before attempting to fetch receipts
          if (selectedBranch && selectedBatch && selectedModeOfPayment) {
            fetchReportReceipts();
          }
        }, [selectedBranch, selectedBatch, selectedModeOfPayment]);

        //All Sum Logic

        const calculateSum = (receipts, field) => {
          const sum = receipts.reduce((sum, receipt) => sum + (receipt[field] || 0), 0);
          return new Intl.NumberFormat('en-IN').format(sum);
        };
        
        // Use the above generic function to calculate each of the sums you need
        const sumOfFirstYearHostelFeePayable = calculateSum(receipts, 'firstYearHostelFeePayable');
        const sumOfFirstYearTotalHostelFeePaid = calculateSum(receipts, 'firstYearTotalHostelFeePaid');
        const sumOfFirstYearTotalHostelFeePending = calculateSum(receipts, 'firstYearTotalHostelFeePending');
        const sumOfFirstYearTuitionFeePayable = calculateSum(receipts, 'firstYearTuitionFeePayable');
        const sumOfFirstYearTotalTuitionFeePaid = calculateSum(receipts, 'firstYearTotalTuitionFeePaid');
        const sumOfFirstYearTotalTuitionFeePending = calculateSum(receipts, 'firstYearTotalTuitionFeePending');
        const sumOfSecondYearHostelFeePayable = calculateSum(receipts, 'secondYearHostelFeePayable');
        const sumOfSecondYearTotalHostelFeePaid = calculateSum(receipts, 'secondYearTotalHostelFeePaid');
        const sumOfSecondYearTotalHostelFeePending = calculateSum(receipts, 'secondYearTotalHostelFeePending');
        const sumOfSecondYearTuitionFeePayable = calculateSum(receipts, 'secondYearTuitionFeePayable');
        const sumOfSecondYearTotalTuitionFeePaid = calculateSum(receipts, 'secondYearTotalTuitionFeePaid');
        const sumOfSecondYearTotalTuitionFeePending = calculateSum(receipts, 'secondYearTotalTuitionFeePending');
        

        const exportSumsToExcel = () => {
          // Prepare data in the desired format
          const dataForExcel = [
            {
              Category: "Category",
              Paid: "Paid",
              Pending: "Pending",
              Total: "Total",
            },
            {
              Category: "1st Year Tuition",
              Paid: sumOfFirstYearTotalTuitionFeePaid,
              Pending: sumOfFirstYearTotalTuitionFeePending,
              Total: sumOfFirstYearTuitionFeePayable,
            },
            {
              Category: "1st Year Hostel",
              Paid: sumOfFirstYearTotalHostelFeePaid,
              Pending: sumOfFirstYearTotalHostelFeePending,
              Total: sumOfFirstYearHostelFeePayable,
            },
            {
              Category: "2nd Year Tuition",
              Paid: sumOfSecondYearTotalTuitionFeePaid,
              Pending: sumOfSecondYearTotalTuitionFeePending,
              Total: sumOfSecondYearTuitionFeePayable,
            },
            {
              Category: "2nd Year Hostel",
              Paid: sumOfSecondYearTotalHostelFeePaid,
              Pending: sumOfSecondYearTotalHostelFeePending,
              Total: sumOfSecondYearHostelFeePayable,
            },
          ];

          // Convert data to worksheet
          const ws = XLSX.utils.json_to_sheet(dataForExcel, { header: ["Category", "Paid", "Pending", "Total"], skipHeader: true });
          ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]; // Optional: Adjust column widths
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Fee Summary");
          XLSX.writeFile(wb, "FeeSummary.xlsx");
        };


        const fetchAnalyticsReceipts = async () => {
          try {
            const SchoolManagementSystemApi = require('school_management_system_api');
            const api = new SchoolManagementSystemApi.DbApi();
            
            let query = {
              // Include other query parameters as needed
              dateIso: {
                $gte: isoFormattedStartDate,
                $lte: isoFormattedEndDate
              }
            }; 
  
            console.log(query);
            const opts = {
              body: {
                collectionName: 'receipts',
                query: query,
                type: 'findMany',
              },
            };
        
            console.log(opts.body);
        
            api.dbGet(opts, function(error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  setAnalyticsReceipts  (responseBody); // Assuming the actual data is in responseBody.data
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });
            
            
            
            
          } catch (error) {
            console.error('Error during fetch:', error);
          }
          console.log(analyticsReceipts)
          const monthWithHighestFee = findMonthWithHighestFeePaid(analyticsReceipts);
          console.log(monthWithHighestFee);
          setHighestFeeMonth(monthWithHighestFee);

          const monthWithLeastFee = findMonthWithLeastFeePaid(analyticsReceipts);
          console.log(monthWithLeastFee);
          setLeastFeeMonth(monthWithLeastFee);

          const averageMonthlyFeePaid = findAverageMonthlyFeePaid(analyticsReceipts, startDate, endDate);
          console.log(averageMonthlyFeePaid);
          setAverageFeePaid(averageMonthlyFeePaid);

          const MostFeePaidDay = findMostFeePaidDate(analyticsReceipts);
          console.log(MostFeePaidDay);
          setMostFeePaidDate(MostFeePaidDay);

          const avgDailyFee = calculateAverageDailyFee(analyticsReceipts);
          console.log(avgDailyFee);
          setAverageDailyFee(avgDailyFee);

          const totalFeeSum = findTotalFeeInRange(analyticsReceipts, startDate, endDate);
          console.log(totalFeeSum);
          setTotalFeeInRange(totalFeeSum);

          
        };
        

        const findMonthWithHighestFeePaid = (receipts) => {
          const monthTotals = receipts.reduce((acc, receipt) => {
              // Extract the month and year from dateIso
              const monthYear = receipt.dateIso.split('T')[0].slice(0, 7); // YYYY-MM
              const totalFeePaid = (receipt.firstYearTotalHostelFeePaid || 0) +
                                   (receipt.firstYearTotalTuitionFeePaid || 0) +
                                   (receipt.secondYearTotalHostelFeePaid || 0) +
                                   (receipt.secondYearTotalTuitionFeePaid || 0);
      
              // Initialize or add to the month's total
              if (!acc[monthYear]) {
                  acc[monthYear] = totalFeePaid;
              } else {
                  acc[monthYear] += totalFeePaid;
              }
      
              return acc;
          }, {});
      
          // Now find the month with the highest total fee paid
          let highestTotal = 0;
          let highestMonth = '';
          Object.entries(monthTotals).forEach(([month, total]) => {
              if (total > highestTotal) {
                  highestTotal = total;
                  highestMonth = month;
              }
          });
      
          // Convert the highestMonth to "YYYY March" format
          const date = new Date(highestMonth + "-01"); // Adding "-01" to make it a full date
          const monthName = date.toLocaleString('default', { month: 'long' });
          const readableMonth = `${date.getFullYear()} ${monthName}`;
      
          console.log(`The month with the highest fee paid is ${readableMonth} with a total of ${highestTotal}`);
      
          return readableMonth; // Return the formatted string
      };
      

      const findMonthWithLeastFeePaid = (receipts) => {
        const monthTotals = receipts.reduce((acc, receipt) => {
            // Extract the month and year from dateIso
            const monthYear = receipt.dateIso.split('T')[0].slice(0, 7); // YYYY-MM
            const totalFeePaid = (receipt.firstYearTotalHostelFeePaid || 0) +
                                 (receipt.firstYearTotalTuitionFeePaid || 0) +
                                 (receipt.secondYearTotalHostelFeePaid || 0) +
                                 (receipt.secondYearTotalTuitionFeePaid || 0);
    
            // Initialize or add to the month's total
            if (!acc[monthYear]) {
                acc[monthYear] = totalFeePaid;
            } else {
                acc[monthYear] += totalFeePaid;
            }
    
            return acc;
        }, {});
    
        // Now find the month with the least total fee paid
        let lowestTotal = Number.MAX_VALUE;
        let lowestMonth = '';
        Object.entries(monthTotals).forEach(([month, total]) => {
            if (total < lowestTotal) {
                lowestTotal = total;
                lowestMonth = month;
            }
        });
    
        // Convert the lowestMonth to "YYYY March" format
        const date = new Date(lowestMonth + "-01"); // Adding "-01" to make it a full date
        const monthName = date.toLocaleString('default', { month: 'long' });
        const readableMonth = `${date.getFullYear()} ${monthName}`;
    
        console.log(`The month with the least fee paid is ${readableMonth} with a total of ${lowestTotal}`);
    
        return readableMonth; // Return the formatted string
    };
    
    const findAverageMonthlyFeePaid = (receipts, startDate, endDate) => {
      // Calculate the number of months in the range
      const start = new Date(startDate);
      const end = new Date(endDate);
      let monthsCount = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
  
      const monthTotals = receipts.reduce((acc, receipt) => {
          // Extract the month and year from dateIso
          const monthYear = receipt.dateIso.split('T')[0].slice(0, 7); // YYYY-MM
          const totalFeePaid = (receipt.firstYearTotalHostelFeePaid || 0) +
                              (receipt.firstYearTotalTuitionFeePaid || 0) +
                              (receipt.secondYearTotalHostelFeePaid || 0) +
                              (receipt.secondYearTotalTuitionFeePaid || 0);
  
          // Initialize or add to the month's total
          if (!acc[monthYear]) {
              acc[monthYear] = totalFeePaid;
          } else {
              acc[monthYear] += totalFeePaid;
          }
  
          return acc;
      }, {});
  
      // Calculate total fee paid
      const totalFee = Object.values(monthTotals).reduce((sum, fee) => sum + fee, 0);
  
      // Calculate average fee per month
      const averageFeePerMonth = totalFee / monthsCount;
  
      console.log(`The average monthly fee paid is ${averageFeePerMonth}`);
  
      return new Intl.NumberFormat('en-IN').format(averageFeePerMonth.toFixed(2));
    };

    const findMostFeePaidDate = (receipts) => {
      const dateTotals = receipts.reduce((acc, receipt) => {
        // Extract the full date from dateIso
        const fullDate = receipt.dateIso.split('T')[0]; // YYYY-MM-DD
        const totalFeePaid = (receipt.firstYearTotalHostelFeePaid || 0) +
                             (receipt.firstYearTotalTuitionFeePaid || 0) +
                             (receipt.secondYearTotalHostelFeePaid || 0) +
                             (receipt.secondYearTotalTuitionFeePaid || 0);
    
        // Initialize or add to the date's total
        if (!acc[fullDate]) {
          acc[fullDate] = totalFeePaid;
        } else {
          acc[fullDate] += totalFeePaid;
        }
    
        return acc;
      }, {});
    
      // Find the date with the highest total fee paid
      let highestTotal = 0;
      let mostFeePaidDate = '';
      Object.entries(dateTotals).forEach(([date, total]) => {
        if (total > highestTotal) {
          highestTotal = total;
          mostFeePaidDate = date;
        }
      });
    
      console.log(`The date with the most fee paid is ${mostFeePaidDate} with a total of ${highestTotal}`);
    
      // Optionally, format the date for readability
      const readableDate = new Date(mostFeePaidDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
      console.log(`The date with the most fee paid is ${readableDate} with a total of ${highestTotal}`);
    
      return readableDate; // Return the formatted date
    };
    
    const calculateAverageDailyFee = (receipts) => {
      let totalFeePaid = 0;
      const uniqueDates = new Set();
    
      receipts.forEach(receipt => {
        // Extract the full date from dateIso
        const fullDate = receipt.dateIso.split('T')[0]; // YYYY-MM-DD
        uniqueDates.add(fullDate);
        
        // Calculate total fee paid for the day
        totalFeePaid += (receipt.firstYearTotalHostelFeePaid || 0) +
                        (receipt.firstYearTotalTuitionFeePaid || 0) +
                        (receipt.secondYearTotalHostelFeePaid || 0) +
                        (receipt.secondYearTotalTuitionFeePaid || 0);
      });
    
      console.log(uniqueDates)
      console.log(uniqueDates.size)
      console.log(totalFeePaid)
      // Calculate the average fee paid per day
      const averageDailyFee = totalFeePaid / uniqueDates.size;
    
      console.log(`The average daily fee paid is: ${averageDailyFee.toFixed(2)}`);
    
      return new Intl.NumberFormat('en-IN').format(averageDailyFee.toFixed(2));
    };

    const findTotalFeeInRange = (receipts, startDate, endDate) => {
      const isoFormattedStartDate = `${startDate}T00:00:00.000Z`;
      const isoFormattedEndDate = `${endDate}T23:59:59.999Z`;
      
      const totalFeePaidInRange = receipts.reduce((total, receipt) => {
        const receiptDate = receipt.dateIso;
        if (receiptDate >= isoFormattedStartDate && receiptDate <= isoFormattedEndDate) {
          return total + (receipt.firstYearTotalHostelFeePaid || 0) +
                         (receipt.firstYearTotalTuitionFeePaid || 0) +
                         (receipt.secondYearTotalHostelFeePaid || 0) +
                         (receipt.secondYearTotalTuitionFeePaid || 0);
        }
        return total;
      }, 0);
    
      console.log(`The total fee paid in the range from ${startDate} to ${endDate} is: ${totalFeePaidInRange}`);
      
      return new Intl.NumberFormat('en-IN').format(totalFeePaidInRange.toFixed(2));
    };
    
    


  
        
        
        
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement );

    const aggregateMonthlyFees = (receipts) => {
      const monthlyAggregates = {}; // Example: { '2024-03': { firstYearTotalHostelFeePaid: 10000, ... }, ... }
    
      receipts.forEach((receipt) => {
        const month = receipt.dateIso.split('T')[0].slice(0, 7); // Get YYYY-MM format
        if (!monthlyAggregates[month]) {
          monthlyAggregates[month] = {
            firstYearTotalHostelFeePaid: 0,
            firstYearTotalTuitionFeePaid: 0,
            secondYearTotalHostelFeePaid: 0,
            secondYearTotalTuitionFeePaid: 0,
          };
        }
        monthlyAggregates[month].firstYearTotalHostelFeePaid += receipt.firstYearTotalHostelFeePaid || 0;
        monthlyAggregates[month].firstYearTotalTuitionFeePaid += receipt.firstYearTotalTuitionFeePaid || 0;
        monthlyAggregates[month].secondYearTotalHostelFeePaid += receipt.secondYearTotalHostelFeePaid || 0;
        monthlyAggregates[month].secondYearTotalTuitionFeePaid += receipt.secondYearTotalTuitionFeePaid || 0;
      });
    
      return monthlyAggregates;
    };

    
    const transformForChart = (aggregatedData) => {
      // Function to format date from "YYYY-MM" to "YYYY MMM"
      const formatDate = (dateString) => {
        const date = new Date(dateString + "-01"); // Adding "-01" to make it a full date
        return date.toLocaleString('default', { year: 'numeric', month: 'short' });
      };
    
      // Sort the keys of aggregatedData which are the months in "YYYY-MM" format
      const sortedMonths = Object.keys(aggregatedData).sort((a, b) => new Date(a) - new Date(b));
    
      // Format each sorted month label
      const labels = sortedMonths.map(formatDate);
    
      const datasets = [
        {
          label: 'First Year Hostel Fee Paid',
          data: sortedMonths.map((month) => aggregatedData[month].firstYearTotalHostelFeePaid),
          backgroundColor: 'rgba(255, 99, 132, 0.8)', // Darker pink
        },
        {
          label: 'First Year Tuition Fee Paid',
          data: sortedMonths.map((month) => aggregatedData[month].firstYearTotalTuitionFeePaid),
          backgroundColor: 'rgba(54, 162, 235, 0.8)', // Darker blue
        },
        {
          label: 'Second Year Hostel Fee Paid',
          data: sortedMonths.map((month) => aggregatedData[month].secondYearTotalHostelFeePaid),
          backgroundColor: 'rgba(255, 206, 86, 0.8)', // Darker yellow
        },
        {
          label: 'Second Year Tuition Fee Paid',
          data: sortedMonths.map((month) => aggregatedData[month].secondYearTotalTuitionFeePaid),
          backgroundColor: 'rgba(75, 192, 192, 0.8)', // Darker turquoise
        },
      ];
    
      return { labels, datasets };
    };

// Inside your component, after fetching the data and transforming it for the chart:
    const { labels, datasets } = transformForChart(aggregateMonthlyFees(analyticsReceipts));

    const chartData = {
      labels,
      datasets,
    };


    const aggregateFeesByBranch = (receipts) => {
      const branchAggregates = {}; // Holds the aggregated data by branch
    
      receipts.forEach((receipt) => {
        const { branch, 
                firstYearTotalHostelFeePaid, firstYearTotalTuitionFeePaid, secondYearTotalHostelFeePaid, secondYearTotalTuitionFeePaid,
                firstYearTotalHostelFeePending, firstYearTotalTuitionFeePending, secondYearTotalHostelFeePending, secondYearTotalTuitionFeePending
              } = receipt;
    
        // Calculate the total fee paid and pending for the current receipt
        const totalFeePaid = firstYearTotalHostelFeePaid + firstYearTotalTuitionFeePaid + secondYearTotalHostelFeePaid + secondYearTotalTuitionFeePaid;
        const totalFeePending = firstYearTotalHostelFeePending + firstYearTotalTuitionFeePending + secondYearTotalHostelFeePending + secondYearTotalTuitionFeePending;
    
        if (!branchAggregates[branch]) {
          branchAggregates[branch] = {
            feePaid: 0,
            feePending: 0,
          };
        }
    
        // Accumulate totals for each branch
        branchAggregates[branch].feePaid += totalFeePaid;
        branchAggregates[branch].feePending += totalFeePending;
      });
    
      return branchAggregates;
    };
    
    
    const transformForBranchChart = (aggregatedData) => {
      const branches = Object.keys(aggregatedData);
    
      const datasets = [
        {
          label: 'Fee Paid',
          data: branches.map((branch) => aggregatedData[branch].feePaid),
          backgroundColor: 'rgba(54, 162, 235, 0.8)', // Example color for fee paid
        },
        {
          label: 'Fee Pending',
          data: branches.map((branch) => aggregatedData[branch].feePending),
          backgroundColor: 'rgba(255, 99, 132, 0.8)', // Example color for fee pending
        },
      ];
    
      return { labels: branches, datasets };
    };
    
    // Assuming analyticsReceipts is your array of receipt objects
    const aggregatedDataByBranch = aggregateFeesByBranch(analyticsReceipts);
    const { labels: branchLabels, datasets: branchDatasets } = transformForBranchChart(aggregatedDataByBranch);
    
    const branchChartData = {
      labels: branchLabels,
      datasets: branchDatasets,
    };


    const aggregateFeesByYear = (receipts) => {
      const yearAggregates = {}; // Holds the aggregated data by year
    
      receipts.forEach((receipt) => {
        const year = new Date(receipt.dateIso).getFullYear();
        console.log(year)
        const totalFeePaid = receipt.firstYearTotalHostelFeePaid + receipt.firstYearTotalTuitionFeePaid +
                             receipt.secondYearTotalHostelFeePaid + receipt.secondYearTotalTuitionFeePaid;
        const totalFeePending = receipt.firstYearTotalHostelFeePending + receipt.firstYearTotalTuitionFeePending +
                                receipt.secondYearTotalHostelFeePending + receipt.secondYearTotalTuitionFeePending;
    
        if (!yearAggregates[year]) {
          yearAggregates[year] = {
            feePaid: 0,
            feePending: 0,
          };
        }
    
        yearAggregates[year].feePaid += totalFeePaid;
        yearAggregates[year].feePending += totalFeePending;
      });
    
      return yearAggregates;
    };

    // Assuming you have a function to transform the aggregated data for ChartJS
    
    
    const calculateGrowthRates = (feePaidData) => {
      let growthRates = [0]; // The first year has no growth rate, so it starts with 0
    
      for (let i = 1; i < feePaidData.length; i++) {
        let growth = (feePaidData[i] - feePaidData[i - 1]);
        growthRates.push(growth);
      }
    
      return growthRates;
    };
    
    const transformYearlyDataForChart = (aggregatedData) => {
      const years = Object.keys(aggregatedData).sort();
      const feePaidData = years.map(year => aggregatedData[year].feePaid);
      const feePendingData = years.map(year => aggregatedData[year].feePending);
      const growthRates = calculateGrowthRates(feePaidData);
    
      const borderColor = growthRates.map(rate => rate >= 0 ? 'green' : 'red');
    
      return {  
        labels: years,
        datasets: [
          {
            label: 'Fees Paid',
            data: feePaidData,
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
          },
          {
            label: 'Fees Pending',
            data: feePendingData,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
          },
          {
            label: 'Growth Rate',
            data: growthRates,
            type: 'line',
            borderColor: borderColor,
            segment: {
              borderColor: context => borderColor[context.p0DataIndex], // Dynamically assign the color based on the growth rate
            },
            borderWidth: 2,
            fill: false,
          },
        ],
      };
    };
    
    
    // Now you can call this function with your aggregated data to get the data structure required by Chart.js
    const yearlyChartData = transformYearlyDataForChart(aggregateFeesByYear(analyticsReceipts));
    








      return (
          <div className="min-h-screen bg-gray-100">
              <Navbar />

              <div className="card bg-slate-600 text-black px-8 py-2 mx-6  text-center"> {/* Increased padding */}
                <h2 className="text-2xl font-bold text-white text-center">REPORTS</h2>
              </div>
              <div className='flex justify-center'>
              <div className="flex flex-col items-center justify-center space-y-4 mt-10 bg-slate-300 px-16 pt-16 pb-8 rounded-3xl">
                <div className="w-full max-w-xs text-black">
                  <label htmlFor="branch" className="form-label">Branch</label>
                  <select
                    required
                    name="branch"
                    id="branch"
                    value={selectedBranch}
                    onChange={(event) => {
                      handleBranchChange(event); // Passes the event to handleBranchChange
                    }}
                
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="">Select Branch</option>
                    <option value="ANY">ANY</option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch.branchCode}>
                        {`${branch.branchName} (${branch.branchCode})`}
                      </option>
                    ))}
                  </select>
                </div>

                  <div className="w-full max-w-xs">
                    
                  <label htmlFor="branch" className="form-label">Batch</label>
                      <select
                          value={selectedBatch} // Controlled by React state
                          onChange={(e) => {
                            setSelectedBatch(e.target.value)
                          }}
                          className="select select-bordered w-full hover:border-blue-500 focus:outline-none focus:ring transition duration-300 ease-in-out"
                      >
                          
                          <option value="" disabled>Select Batch</option>
                          <option value="ANY">ANY</option>
                          {batchOptions.map((batch, index) => (
                          <option key={index} value={batch}>
                              {batch}
                          </option>
                          ))}
                      </select>
                  </div>
                  <div className="w-full max-w-xs">
                    
                  <label htmlFor="branch" className="form-label">Mode of Payment</label>
                    <select 
                      className="select select-bordered w-full hover:border-blue-500 focus:outline-none focus:ring transition duration-300 ease-in-out"
                      onChange={(e) => {
                        setSelectedModeOfPayment(e.target.value)
                      }} // Pass the event to the function
                    >
                      <option value="" disabled>MODE OF PAYMENT</option>
                      <option value="ANY">ANY</option>
                      <option value="BANK TRANSFER/UPI">BANK TRANSFER/UPI</option>
                      <option value="CASH">CASH</option>
                      <option value="CARD">CARD</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>

                <div className='py-4'>
                  <button
                    onClick={handleFetchClick}
                    className="btn mt-4"
                    style={{backgroundColor: '#00A0E3', color:'#FFFFFF'}}
                  >
                    Fetch Report
                  </button>
                </div>
                
              </div>
              </div>
              
              
          {/* <div className="w-full max-w-xs bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Selected Criteria:</h3>
            <p>Selected Branch: <strong>{selectedBranch }</strong></p>
            <p>Selected Batch: <strong>{selectedBatch || "None"}</strong></p> 
            <p>Selected Mode of Payment: <strong>{ selectedModeOfPayment|| "None"}</strong></p>
          </div>
              
          <div className="w-full max-w-4xl mt-5">
            <p>==================================</p>
            <div className="w-full max-w-4xl mt-5">
            {
              receipts.length > 0 ? (
                receipts.map((receipt) => (
                  <div key={receipt.receiptNumber}>  
                    <p>Name: {receipt.studentName} Receipt ID: {receipt.receiptNumber}</p>
                  </div>
                ))
              ) : (
                <p>No receipts found.</p>
              )
            }
          </div>
          <p>==================================</p>
            

          </div>   */}

          

          <div className='flex justify-center mt-4'>
            <button onClick={exportSumsToExcel} style={{backgroundColor: '#00A0E3', color:'#FFFFFF'}} className="btn">
            Export to Excel
          </button>
          </div>
          
          <div className="grid grid-rows-4 grid-cols-3 gap-4 p-6 m-4">
            {/* <!-- Row 1 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) APPLIED:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearTuitionFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) PAID:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearTotalTuitionFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) PENDING:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearTotalTuitionFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 2 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) APPLIED:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearHostelFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) PAID:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearTotalHostelFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) PENDING:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfFirstYearTotalHostelFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 3 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) APPLIED:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearTuitionFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) PAID:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearTotalTuitionFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) PENDING:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearTotalTuitionFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 4 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) APPLIED:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearHostelFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) PAID:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearTotalHostelFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">              
              <div className="text-sm font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) PENDING:</div>
              <p className="text-white text-2xl font-bold"> ₹ {sumOfSecondYearTotalHostelFeePending.toLocaleString()}</p>
            </div>
          </div>

          <div className="card bg-slate-600 text-black px-8 py-2 mx-6  text-center"> {/* Increased padding */}
            <h2 className="text-2xl font-bold text-white text-center">ANALYTICS</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-center bg py-4 pl-64">
              <div className='w-80 bg-slate-300 px-4 rounded-lg pb-4 text-center'>
                <label className="block text-lg font-medium text-gray-700 w-full">From Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input mt-1 block w-full py-2 px-4 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-center bg py-4 pr-64">
              <div className='w-80 bg-slate-300 px-4 rounded-lg pb-4 text-center'>
                <label className="block text-lg font-medium text-gray-700 w-full">To Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input mt-1 block w-full py-2 px-4 rounded-xl"
                  min={startDate}
                />
              </div>
            </div>
          </div>

          {/* <p>{startDate} {endDate}</p> */}

          <div className="flex justify-center items-center">
            <button
              onClick={fetchAnalyticsReceipts} // Call fetchAnalyticsReceipts when the button is clicked
              className="btn my-8"
              style={{ backgroundColor: '#00A0E3', color: '#FFFFFF' }}
            >
              Fetch Analytics
            </button>
          </div>



          {/* <div className="mt-5 w-full max-w-4xl">
            <h2 className="text-lg font-semibold mb-4">Fetched Receipts:</h2>
            {analyticsReceipts.length > 0 ? (
              <div>
                {analyticsReceipts.map((receipt, index) => (
                  <div key={index} className="">
                    <p>Receipt ID: {receipt.receiptNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No receipts found.</p>
            )}
          </div>  */}

          
          <div className="flex flex-col space-y-4 mt-4 items-center">
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Most Fee Paid Month: <strong className=" text-lg" >{highestFeeMonth}</strong></p>
              </div>
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Least Fee Paid Month: <strong className=" text-lg" >{leastFeeMonth}</strong></p>
              </div>
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Average Monthly Fee: <strong className=" text-lg" >{averageFeePaid}</strong></p>
              </div>
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Most Fee Paid Date: <strong className=" text-lg" >{mostFeePaidDate}</strong></p>
              </div>
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Average Daily Fee: <strong className=" text-lg" >{averageDailyFee}</strong></p>
              </div>
              <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="card p-4 rounded-lg shadow-lg w-1/3">
                  <p>Total Fee In The Range is: <strong className=" text-lg" >{totalFeeInRange}</strong></p>
              </div>
          </div>


          <div className='pt-16'>
            <div className="relative overflow-x-auto">
              <div style={{ minWidth: '1200px' }}> {/* Make sure minWidth is sufficient for your chart */}
                <Bar data={chartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Fee Payment Summary',
                      font: {
                        size: 24 // You can set the font size here
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>


          <div className='pt-16'>
            <div className="relative overflow-x-auto">
              <div style={{ minWidth: '1200px' }}> {/* Make sure minWidth is sufficient for your chart */}
                <Bar data={branchChartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Fee Payment Summary by Branch',
                      font: {
                        size: 24, // Adjust as needed
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount in Currency',
                        font: {
                          size: 16, // Adjust as needed
                        },
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Branch',
                        font: {
                          size: 16, // Adjust as needed
                        },
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>

          <div className='pt-16'>
            <div className="relative overflow-x-auto">
              <div style={{ minWidth: '1200px' }}> {/* Make sure minWidth is sufficient for your chart */}
                <Bar data={yearlyChartData} options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount in Rupees'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Year'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Yearly Fee Collection Summary',
                      font: {
                        size: 24
                      },
                    },
                  },
                }} />
              </div>
            </div>
          </div>


          


        </div>
      );
      
  };

  export default Analytics;
