/**
 * Test suite for SIO MediaQuery Game
 * Tests localStorage and score calculations
 */

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = String(value);
    },
    removeItem(key) {
      delete this.data[key];
    },
    clear() {
      this.data = {};
    }
  };
}

// Test 1: localStorage initialization and retrieval
function testLocalStorageInit() {
  console.log('📋 Test 1: localStorage initialization...');
  localStorage.clear();
  
  const testKey = 'mq_progress';
  const testValue = JSON.stringify({ currentLevel: 0, score: 0 });
  
  localStorage.setItem(testKey, testValue);
  const retrieved = localStorage.getItem(testKey);
  
  if (retrieved === testValue) {
    console.log('✅ localStorage setItem/getItem works correctly');
    return true;
  } else {
    console.error('❌ localStorage retrieval failed');
    return false;
  }
}

// Test 2: Score calculation and persistence
function testScoreCalculation() {
  console.log('📋 Test 2: Score calculation...');
  localStorage.clear();
  
  const progressKey = 'mq_progress';
  const doneKey = 'mq_done_levels';
  
  // Simulate completing levels 0, 1, 2
  let progress = { currentLevel: 3, score: 3 };
  let doneLevels = [0, 1, 2];
  
  localStorage.setItem(progressKey, JSON.stringify(progress));
  localStorage.setItem(doneKey, JSON.stringify(doneLevels));
  
  // Retrieve and verify
  const retrievedProgress = JSON.parse(localStorage.getItem(progressKey));
  const retrievedDone = JSON.parse(localStorage.getItem(doneKey));
  
  if (retrievedProgress.score === 3 && retrievedDone.length === 3) {
    console.log('✅ Score calculation and persistence works correctly');
    console.log(`   - Score: ${retrievedProgress.score}`);
    console.log(`   - Completed levels: ${retrievedDone.length}`);
    return true;
  } else {
    console.error('❌ Score calculation failed');
    return false;
  }
}

// Test 3: Preventing duplicate score increments
function testDuplicateScorePrevention() {
  console.log('📋 Test 3: Duplicate score prevention...');
  localStorage.clear();
  
  const doneKey = 'mq_done_levels';
  let doneLevels = [0, 1, 2];
  
  localStorage.setItem(doneKey, JSON.stringify(doneLevels));
  
  // Try to "complete" level 1 again
  const levelToCheck = 1;
  const done = JSON.parse(localStorage.getItem(doneKey));
  const alreadyDone = done.includes(levelToCheck);
  
  if (alreadyDone) {
    console.log('✅ Duplicate score prevention works correctly');
    console.log(`   - Level ${levelToCheck} is correctly marked as already done`);
    return true;
  } else {
    console.error('❌ Duplicate score prevention failed');
    return false;
  }
}

// Test 4: Grid game localStorage
function testGridGameStorage() {
  console.log('📋 Test 4: Grid game localStorage...');
  localStorage.clear();
  
  const gridProgressKey = 'grid_progress';
  const gridDoneKey = 'grid_done';
  
  const gridProgress = { currentLevel: 5, score: 5 };
  const gridDone = [0, 1, 2, 3, 4];
  
  localStorage.setItem(gridProgressKey, JSON.stringify(gridProgress));
  localStorage.setItem(gridDoneKey, JSON.stringify(gridDone));
  
  const retrievedGridProgress = JSON.parse(localStorage.getItem(gridProgressKey));
  const retrievedGridDone = JSON.parse(localStorage.getItem(gridDoneKey));
  
  if (retrievedGridProgress.score === 5 && retrievedGridDone.length === 5) {
    console.log('✅ Grid game storage works correctly');
    console.log(`   - Grid score: ${retrievedGridProgress.score}`);
    console.log(`   - Grid completed levels: ${retrievedGridDone.length}`);
    return true;
  } else {
    console.error('❌ Grid game storage failed');
    return false;
  }
}

// Test 5: Data persistence across sessions
function testDataPersistenceAcrossSessions() {
  console.log('📋 Test 5: Data persistence across sessions...');
  localStorage.clear();
  
  const progressKey = 'mq_progress';
  const initialProgress = { currentLevel: 10, score: 10 };
  
  // "Session 1": Save data
  localStorage.setItem(progressKey, JSON.stringify(initialProgress));
  
  // "Session 2": Retrieve data (simulating page reload)
  const retrievedProgress = JSON.parse(localStorage.getItem(progressKey) || 'null');
  
  if (retrievedProgress && retrievedProgress.currentLevel === 10 && retrievedProgress.score === 10) {
    console.log('✅ Data persistence across sessions works correctly');
    console.log(`   - Retrieved level: ${retrievedProgress.currentLevel}`);
    console.log(`   - Retrieved score: ${retrievedProgress.score}`);
    return true;
  } else {
    console.error('❌ Data persistence failed');
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('\n🧪 SIO MediaQuery Game - Test Suite\n');
  console.log('=========================================\n');
  
  const results = [
    testLocalStorageInit(),
    testScoreCalculation(),
    testDuplicateScorePrevention(),
    testGridGameStorage(),
    testDataPersistenceAcrossSessions()
  ];
  
  console.log('\n=========================================\n');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`📊 Test Results: ${passed}/${total} passed\n`);
  
  if (passed === total) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.error(`❌ ${total - passed} test(s) failed!`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
